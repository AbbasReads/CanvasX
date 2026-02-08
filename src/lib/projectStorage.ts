import { CanvasElement } from '@/contexts/BuilderContext';

export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  elements: CanvasElement[];
  createdAt: number;
  updatedAt: number;
}

const PROJECTS_KEY = 'canvasx_projects';
const CURRENT_PROJECT_KEY = 'canvasx_current_project';

export function getAllProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export function getProject(id: string): Project | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

export function saveProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Project {
  const projects = getAllProjects();
  const now = Date.now();
  
  if (project.id) {
    // Update existing project
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      const updatedProject: Project = {
        ...projects[index],
        ...project,
        id: project.id,
        updatedAt: now,
      };
      projects[index] = updatedProject;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return updatedProject;
    }
  }
  
  // Create new project
  const newProject: Project = {
    ...project,
    id: project.id || `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  
  projects.push(newProject);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return newProject;
}

export function deleteProject(id: string): void {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  
  // Clear current project if it's the one being deleted
  const currentProjectId = getCurrentProjectId();
  if (currentProjectId === id) {
    clearCurrentProject();
  }
}

export function duplicateProject(id: string): Project | null {
  const project = getProject(id);
  if (!project) return null;
  
  const newProject = saveProject({
    name: `${project.name} (Copy)`,
    description: project.description,
    elements: JSON.parse(JSON.stringify(project.elements)), // Deep clone
  });
  
  return newProject;
}

export function getCurrentProjectId(): string | null {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
}

export function setCurrentProjectId(id: string): void {
  localStorage.setItem(CURRENT_PROJECT_KEY, id);
}

export function clearCurrentProject(): void {
  localStorage.removeItem(CURRENT_PROJECT_KEY);
}

export function exportProject(project: Project): void {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${project.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importProject(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string) as Project;
        const imported = saveProject({
          name: `${project.name} (Imported)`,
          description: project.description,
          elements: project.elements,
        });
        resolve(imported);
      } catch (error) {
        reject(new Error('Invalid project file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Generate thumbnail from canvas elements
export function generateThumbnail(elements: CanvasElement[]): string {
  // For now, return a placeholder
  // In a real implementation, you could use html-to-image or similar
  return '';
}
