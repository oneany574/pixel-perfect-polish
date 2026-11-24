import { describe, test, expect } from 'bun:test';
import { hasAdminRole, safeHref, contentSchema, defaultContent } from './content';
describe('CMS rules',()=>{
 test('ordinary accounts cannot manage website content',()=>{expect(hasAdminRole(['user'])).toBe(false)});
 test('administrators can manage website content',()=>{expect(hasAdminRole(['admin'])).toBe(true)});
 test('links cannot run script URLs',()=>{expect(safeHref('javascript:alert(1)')).toBe('#')});
 test('duplicate section identifiers are rejected',()=>{expect(contentSchema.safeParse({...defaultContent,sections:[...defaultContent.sections,defaultContent.sections[0]]}).success).toBe(false)});
});
