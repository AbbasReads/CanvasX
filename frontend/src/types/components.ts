/**
 * Component-specific interfaces for academic portfolio components
 */

/**
 * Publication entry for publications components
 */
export interface PublicationEntry {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  abstract?: string;
  pdfUrl?: string;
  externalUrl?: string;
}

/**
 * Publications Carousel component props
 */
export interface PublicationsCarouselProps {
  publications: PublicationEntry[];
  showAbstract: boolean;
  accentColor: string;
}

/**
 * Publications List component props
 */
export interface PublicationsListProps {
  publications: PublicationEntry[];
  showAbstract: boolean;
  groupByYear: boolean;
}

/**
 * Research area entry
 */
export interface ResearchArea {
  id: string;
  name: string;
  description?: string;
}

/**
 * Research Areas Grid component props
 */
export interface ResearchAreasGridProps {
  areas: ResearchArea[];
  columns: 2 | 3 | 4;
  showDescriptions: boolean;
}

/**
 * Teaching entry for timeline
 */
export interface TeachingEntry {
  id: string;
  courseName: string;
  institution: string;
  semester: string;
  year: number;
  description?: string;
}

/**
 * Teaching Timeline component props
 */
export interface TeachingTimelineProps {
  entries: TeachingEntry[];
  sortOrder: 'chronological' | 'reverse-chronological';
}

/**
 * External Links Bar component props
 */
export interface ExternalLinksBarProps {
  googleScholarUrl?: string;
  researchGateUrl?: string;
  linkedInUrl?: string;
  orcidUrl?: string;
  githubUrl?: string;
  personalWebsiteUrl?: string;
  iconSize: 'small' | 'medium' | 'large';
  alignment: 'left' | 'center' | 'right';
}

/**
 * Contact Card component props
 */
export interface ContactCardProps {
  email?: string;
  officeLocation?: string;
  phoneNumber?: string;
  officeHours?: string;
  showIcons: boolean;
}

/**
 * Bio Section component props
 */
export interface BioSectionProps {
  heading: string;
  content: string;
  profileImageUrl?: string;
  imagePosition: 'left' | 'right' | 'center' | 'none';
  imageSize: 'small' | 'medium' | 'large';
}

/**
 * Education entry
 */
export interface EducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: number;
  honors?: string;
}

/**
 * Education Section component props
 */
export interface EducationSectionProps {
  entries: EducationEntry[];
  showHonors: boolean;
}

/**
 * Gallery image entry
 */
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

/**
 * Image Gallery component props
 */
export interface ImageGalleryProps {
  images: GalleryImage[];
  columns: 2 | 3 | 4;
  imageAspectRatio: 'square' | '16:9' | '4:3' | 'auto';
}

/**
 * General Info component props (basic profile section)
 */
export interface GeneralInfoProps {
  name: string;
  title: string;
  institution: string;
  department?: string;
  profileImageUrl?: string;
}
