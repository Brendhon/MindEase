import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateRandomUUID } from '@/utils/uuid/uuid';

describe('generateRandomUUID', () => {
  // Helper functions for crypto mocking
  const createMockCryptoWithRandomUUID = (
    uuidValue: string = 'test-uuid-123'
  ) => {
    const mockRandomUUID = vi.fn(
      () => uuidValue as `${string}-${string}-${string}-${string}-${string}`
    );
    return {
      getRandomValues: vi.fn((array: ArrayBufferView) => array),
      subtle: {} as SubtleCrypto,
      randomUUID: mockRandomUUID,
    } as Crypto;
  };

  const createMockCryptoWithoutRandomUUID = () => {
    return {
      getRandomValues: vi.fn((array: ArrayBufferView) => array),
      subtle: {} as SubtleCrypto,
      randomUUID: undefined,
    } as unknown as Crypto;
  };

  const createEmptyMockCrypto = () => {
    return {} as Crypto;
  };

  const removeCrypto = () => {
    delete (global as { crypto?: Crypto }).crypto;
  };

  const setCrypto = (mockCrypto: Crypto) => {
    (global as { crypto: Crypto }).crypto = mockCrypto;
  };

  beforeEach(() => {
    // Clean up crypto before each test to ensure isolation
    removeCrypto();
  });

  afterEach(() => {
    // Clean up crypto after each test to ensure isolation
    removeCrypto();
  });

  it('should generate a string', () => {
    // Test fallback behavior when crypto is not available
    removeCrypto();

    const uuid = generateRandomUUID();
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
  });

  it('should use crypto.randomUUID when available', () => {
    const mockCrypto = createMockCryptoWithRandomUUID('test-uuid-123');
    setCrypto(mockCrypto);

    const uuid = generateRandomUUID();
    expect(uuid).toBe('test-uuid-123');
    expect(mockCrypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('should fallback to timestamp-based ID when crypto.randomUUID is not available', () => {
    const mockCrypto = createEmptyMockCrypto();
    setCrypto(mockCrypto);

    const uuid = generateRandomUUID();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('should generate unique IDs on multiple calls', () => {
    // Test fallback behavior when crypto is not available
    removeCrypto();

    const uuid1 = generateRandomUUID();
    const uuid2 = generateRandomUUID();

    // Even with timestamp fallback, IDs should be different
    // (unless called in the exact same millisecond, which is unlikely)
    expect(uuid1).not.toBe(uuid2);
  });

  it('should handle crypto being undefined', () => {
    removeCrypto();

    const uuid = generateRandomUUID();
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
  });

  it('should handle crypto existing but randomUUID being undefined', () => {
    const mockCrypto = createMockCryptoWithoutRandomUUID();
    setCrypto(mockCrypto);

    const uuid = generateRandomUUID();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('should generate valid format for fallback ID', () => {
    removeCrypto();

    const uuid = generateRandomUUID();
    // Format: timestamp-randomstring
    const parts = uuid.split('-');
    expect(parts.length).toBeGreaterThanOrEqual(2);
    expect(Number(parts[0])).toBeGreaterThan(0); // timestamp should be positive
  });
});
