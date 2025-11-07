import { FrenchDictionaryGateway } from './FrenchDictionaryGateway';

describe('FrenchDictionaryGateway', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('returns false for empty/whitespace word', async () => {
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('   ')).toBe(false);
  });

  it('returns true when dictionaryapi.dev succeeds', async () => {
    global.fetch = jest.fn(async (url: any) => {
      if (String(url).includes('dictionaryapi.dev')) {
        return { status: 200, ok: true, json: async () => ([{ word: 'test' }]) } as any;
      }
      return { status: 404, ok: false, json: async () => ({}) } as any;
    });
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('test')).toBe(true);
  });

  it('falls back to wiktionary when dictionaryapi.dev 404', async () => {
    global.fetch = jest.fn(async (url: any, init?: any) => {
      const u = String(url);
      if (u.includes('dictionaryapi.dev')) {
        return { status: 404, ok: false, json: async () => ({}) } as any;
      }
      if (u.includes('w/api.php')) {
        return { ok: true, json: async () => ({ query: { pages: { '123': { title: 'mot' } } } }) } as any;
      }
      return { ok: true, status: 200 } as any;
    });
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('mot')).toBe(true);
  });

  it('returns false when both sources fail', async () => {
    global.fetch = jest.fn(async () => ({ status: 500, ok: false, json: async () => ({}) })) as any;
    const gw = new FrenchDictionaryGateway();
    expect(await gw.isValid('introuvable')).toBe(false);
  });
});
