/** @jest-environment node */
import { POST } from './validateWord';
import * as container from '@/src/frameworks/drivers/container';

jest.mock('@/src/frameworks/drivers/container', () => ({
  makeValidateWordUseCase: jest.fn(),
}));

describe('validateWord HTTP handler', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns 400 for invalid payload', async () => {
    const req = new Request('http://test/validate-word', {
      method: 'POST',
      body: JSON.stringify({ bad: true })
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.valid).toBe(false);
  });

  it('delegates to use case and returns result', async () => {
    (container.makeValidateWordUseCase as jest.Mock).mockReturnValue({
      execute: async (w: string) => ({ valid: w === 'validé', normalized: w })
    });
    const req = new Request('http://test/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: 'validé' })
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({ valid: true, normalized: 'validé' });
  });

  it('returns safe fallback on error', async () => {
    (container.makeValidateWordUseCase as jest.Mock).mockReturnValue({
      execute: async () => { throw new Error('boom'); }
    });
    const req = new Request('http://test/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: 'x' })
    });
    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({ valid: false, normalized: '' });
  });
});
