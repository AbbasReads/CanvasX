/**
 * Zero-dependency pure TypeScript in-memory ZIP builder.
 * Generates valid standard PKZip archive blobs compatible with Netlify, GitHub, OS unzip, etc.
 */

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function calculateCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileInput {
  name: string;
  content: string | Uint8Array;
}

export function createZipArchive(files: ZipFileInput[]): Uint8Array {
  const textEncoder = new TextEncoder();
  const fileEntries = files.map((file) => {
    const data = typeof file.content === 'string' ? textEncoder.encode(file.content) : file.content;
    const nameBytes = textEncoder.encode(file.name);
    const crc = calculateCrc32(data);
    return {
      name: file.name,
      nameBytes,
      data,
      crc,
      localHeaderOffset: 0,
    };
  });

  const chunks: Uint8Array[] = [];
  let currentOffset = 0;

  // 1. Write Local File Headers + File Data
  for (const entry of fileEntries) {
    entry.localHeaderOffset = currentOffset;

    const localHeader = new Uint8Array(30 + entry.nameBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed (2.0)
    view.setUint16(6, 0x0800, true); // General purpose bit flag (Bit 11: UTF-8)
    view.setUint16(8, 0, true); // Compression: Store (no compression)
    view.setUint16(10, 0x4000, true); // Last mod file time (approx 08:00)
    view.setUint16(12, 0x5421, true); // Last mod file date (approx 2026-01-01)
    view.setUint32(14, entry.crc, true); // CRC-32
    view.setUint32(18, entry.data.length, true); // Compressed size
    view.setUint32(22, entry.data.length, true); // Uncompressed size
    view.setUint16(26, entry.nameBytes.length, true); // Filename length
    view.setUint16(28, 0, true); // Extra field length

    localHeader.set(entry.nameBytes, 30);

    chunks.push(localHeader);
    chunks.push(entry.data);
    currentOffset += localHeader.length + entry.data.length;
  }

  const centralDirectoryOffset = currentOffset;

  // 2. Write Central Directory Headers
  for (const entry of fileEntries) {
    const centralHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(centralHeader.buffer);

    view.setUint32(0, 0x02014b50, true); // Central directory signature
    view.setUint16(4, 20, true); // Version made by (DOS/FAT, 2.0)
    view.setUint16(6, 20, true); // Version needed (2.0)
    view.setUint16(8, 0x0800, true); // Bit 11 UTF-8
    view.setUint16(10, 0, true); // Compression: Store
    view.setUint16(12, 0x4000, true); // File time
    view.setUint16(14, 0x5421, true); // File date
    view.setUint32(16, entry.crc, true); // CRC-32
    view.setUint32(20, entry.data.length, true); // Compressed size
    view.setUint32(24, entry.data.length, true); // Uncompressed size
    view.setUint16(28, entry.nameBytes.length, true); // Filename length
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // Comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal attributes
    view.setUint32(38, 0x81a40000, true); // External attributes (regular file 0644)
    view.setUint32(42, entry.localHeaderOffset, true); // Offset of local header

    centralHeader.set(entry.nameBytes, 46);

    chunks.push(centralHeader);
    currentOffset += centralHeader.length;
  }

  const centralDirectorySize = currentOffset - centralDirectoryOffset;

  // 3. Write End of Central Directory Record (EOCD)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true); // Disk number
  eocdView.setUint16(6, 0, true); // Disk with central dir
  eocdView.setUint16(8, fileEntries.length, true); // Entries on this disk
  eocdView.setUint16(10, fileEntries.length, true); // Total entries
  eocdView.setUint32(12, centralDirectorySize, true); // Size of central dir
  eocdView.setUint32(16, centralDirectoryOffset, true); // Offset of central dir
  eocdView.setUint16(20, 0, true); // Comment length

  chunks.push(eocd);

  // Combine all chunks into a single Uint8Array
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
}

export function createZipBlob(files: ZipFileInput[]): Blob {
  const buffer = createZipArchive(files);
  return new Blob([buffer], { type: 'application/zip' });
}

