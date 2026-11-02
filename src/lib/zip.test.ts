import { describe, it, expect } from 'vitest';
import { createZipArchive } from './zip';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as os from 'os';

describe('createZipArchive', () => {
  it('generates a valid ZIP archive readable by unzip CLI', () => {
    const files = [
      { name: 'index.html', content: '<!doctype html><html><body><h1>Hello World</h1></body></html>' },
      { name: 'styles.css', content: 'body { background: #f0f0f0; }' },
    ];

    const zipBytes = createZipArchive(files);
    expect(zipBytes.length).toBeGreaterThan(0);

    // Write to a temporary file and verify with /usr/bin/unzip -t (test archive)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zip-test-'));
    const zipPath = path.join(tmpDir, 'test.zip');
    fs.writeFileSync(zipPath, Buffer.from(zipBytes));

    const testOutput = execSync(`unzip -t "${zipPath}"`, { encoding: 'utf-8' });
    expect(testOutput).toContain('No errors detected');
    expect(testOutput).toContain('index.html');
    expect(testOutput).toContain('styles.css');

    // Extract and verify contents
    execSync(`unzip "${zipPath}" -d "${tmpDir}/extracted"`);
    const extractedHtml = fs.readFileSync(path.join(tmpDir, 'extracted', 'index.html'), 'utf-8');
    const extractedCss = fs.readFileSync(path.join(tmpDir, 'extracted', 'styles.css'), 'utf-8');

    expect(extractedHtml).toBe(files[0].content);
    expect(extractedCss).toBe(files[1].content);

    // Clean up
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

