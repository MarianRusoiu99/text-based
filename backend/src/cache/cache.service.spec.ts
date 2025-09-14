import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = mockCacheManager;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should call cacheManager.get with correct key', async () => {
      const key = 'test-key';
      const expectedValue = 'test-value';
      cacheManager.get.mockResolvedValue(expectedValue);

      const result = await service.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBe(expectedValue);
    });
  });

  describe('set', () => {
    it('should call cacheManager.set with key and value', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await service.set(key, value);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, undefined);
    });

    it('should call cacheManager.set with ttl when provided', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttl = 300;

      await service.set(key, value, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });

  describe('del', () => {
    it('should call cacheManager.del with correct key', async () => {
      const key = 'test-key';

      await service.del(key);

      expect(cacheManager.del).toHaveBeenCalledWith(key);
    });
  });

  describe('reset', () => {
    it('should call cacheManager.reset when available', async () => {
      cacheManager.reset.mockResolvedValue(undefined);

      await service.reset();

      expect(cacheManager.reset).toHaveBeenCalled();
    });

    it('should not throw when reset is not available', async () => {
      delete cacheManager.reset;

      await expect(service.reset()).resolves.not.toThrow();
    });
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const key = 'test-key';
      const cachedValue = 'cached-value';
      const factory = jest.fn();

      cacheManager.get.mockResolvedValue(cachedValue);

      const result = await service.getOrSet(key, factory);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(factory).not.toHaveBeenCalled();
      expect(result).toBe(cachedValue);
    });

    it('should call factory and cache result if not cached', async () => {
      const key = 'test-key';
      const factoryValue = 'factory-value';
      const factory = jest.fn().mockResolvedValue(factoryValue);

      cacheManager.get.mockResolvedValue(undefined);

      const result = await service.getOrSet(key, factory);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(factory).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        key,
        factoryValue,
        undefined,
      );
      expect(result).toBe(factoryValue);
    });

    it('should pass ttl to set when provided', async () => {
      const key = 'test-key';
      const factoryValue = 'factory-value';
      const ttl = 600;
      const factory = jest.fn().mockResolvedValue(factoryValue);

      cacheManager.get.mockResolvedValue(undefined);

      const result = await service.getOrSet(key, factory, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(key, factoryValue, ttl);
      expect(result).toBe(factoryValue);
    });
  });
});
