/**
 * Basic setup test to verify the testing infrastructure
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateComponentId, generateProjectId } from '../utils/idGenerator';

describe('Project Setup', () => {
  it('should have fast-check installed and working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      })
    );
  });

  it('should generate unique component IDs', () => {
    const id1 = generateComponentId();
    const id2 = generateComponentId();
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^comp_/);
  });

  it('should generate unique project IDs', () => {
    const id1 = generateProjectId();
    const id2 = generateProjectId();
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^proj_/);
  });
});
