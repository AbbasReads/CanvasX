/**
 * Utility for generating unique component and project IDs
 */

/**
 * Generate a unique ID for components
 * Uses timestamp + random string for uniqueness
 */
export function generateComponentId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `comp_${timestamp}_${randomStr}`;
}

/**
 * Generate a unique ID for projects
 * Uses timestamp + random string for uniqueness
 */
export function generateProjectId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `proj_${timestamp}_${randomStr}`;
}

/**
 * Generate a unique ID for array items (publications, research areas, etc.)
 */
export function generateItemId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `item_${timestamp}_${randomStr}`;
}
