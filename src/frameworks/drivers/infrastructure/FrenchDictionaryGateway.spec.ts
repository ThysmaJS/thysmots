import { FrenchDictionaryGateway } from './FrenchDictionaryGateway';

describe('FrenchDictionaryGateway (optimized)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('returns false for empty/whitespace word', async () => {
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('   ')).toBe(false);
  });

  it('HEAD success => true without calling dictionary API', async () => {
    const fetchMock = jest.fn(async (url: any, init?: any) => {
      if (init?.method === 'HEAD') return { ok: true } as any;
      return { status: 404, ok: false } as any;
    });
    global.fetch = fetchMock as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('test')).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1); // only HEAD
  });

  it('HEAD network error + fallback success => true', async () => {
    const fetchMock = jest.fn(async (url: any, init?: any) => {
      if (init?.method === 'HEAD') throw new Error('network');
      return { status: 200, ok: true } as any; // dictionary api fallback
    });
    global.fetch = fetchMock as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('mot')).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2); // HEAD + fallback
  });

  it('HEAD fail + fallback 404 => false', async () => {
    const fetchMock = jest.fn(async (url: any, init?: any) => {
      if (init?.method === 'HEAD') return { ok: false } as any;
      return { status: 404, ok: false } as any;
    });
    global.fetch = fetchMock as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('introuvable')).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('caches positive result (second call only hits cache)', async () => {
    let calls = 0;
    global.fetch = jest.fn(async (url: any, init?: any) => {
      calls++; if (init?.method === 'HEAD') return { ok: true } as any; return { status: 404, ok: false } as any; }) as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('cachetest')).toBe(true);
    expect(await gw.isValid('cachetest')).toBe(true);
    expect(calls).toBe(1); // second call served from cache
  });

  it('caches negative result', async () => {
    let calls = 0;
    global.fetch = jest.fn(async (url: any, init?: any) => { calls++; return { ok: false, status: 404 } as any; }) as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('xyz')).toBe(false);
    expect(await gw.isValid('xyz')).toBe(false);
    expect(calls).toBe(2); // still two (HEAD + fallback) because first negative triggers fallback
  });

  it('can disable fallback to dictionary API', async () => {
    const fetchMock = jest.fn(async (url: any, init?: any) => ({ ok: false, status: 404 })) as any;
    global.fetch = fetchMock;
    const gw = new FrenchDictionaryGateway(undefined, undefined, { fallbackDictApi: false });
    expect(await gw.isValid('nope')).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1); // only HEAD
  });
});
