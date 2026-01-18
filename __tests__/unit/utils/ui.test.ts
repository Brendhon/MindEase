import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/ui/ui';

describe('cn (class name utility)', () => {
  it('should merge simple string classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle single class', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('should handle empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('should filter out falsy values', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', null, 'bar', undefined, 'baz')).toBe('foo bar baz');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
    expect(cn('foo', ['bar', 'baz'])).toBe('foo bar baz');
  });

  it('should handle objects with conditional classes', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should merge Tailwind classes correctly (tailwind-merge)', () => {
    // p-2 should override p-4
    expect(cn('p-4', 'p-2')).toBe('p-2');

    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500');

    // Multiple conflicting classes
    expect(cn('p-4 m-2', 'p-2 m-4')).toBe('p-2 m-4');
  });

  it('should handle mixed inputs', () => {
    expect(cn('foo', ['bar', 'baz'], { qux: true, quux: false })).toBe(
      'foo bar baz qux'
    );
  });

  it('should handle complex nested structures', () => {
    expect(
      cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        { 'object-class': true, 'false-class': false },
        'final-class'
      )
    ).toBe('base-class array-class-1 array-class-2 object-class final-class');
  });

  it('should handle Tailwind responsive and state variants', () => {
    expect(cn('p-4', 'md:p-6', 'hover:p-8')).toBe('p-4 md:p-6 hover:p-8');
  });

  it('should handle duplicate classes', () => {
    // clsx may or may not deduplicate, so we just check it contains the classes
    const result = cn('foo', 'bar', 'foo');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });
});
