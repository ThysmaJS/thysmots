/** @jest-environment node */
import { getLeaderboard, postLeaderboard } from './leaderboard';
import * as container from '@/src/frameworks/drivers/container';

jest.mock('@/src/frameworks/drivers/container', () => ({
  makeListLeaderboardUseCase: jest.fn(),
  makeSubmitScoreUseCase: jest.fn(),
}));

describe('leaderboard HTTP handlers', () => {
  beforeEach(() => jest.resetAllMocks());

  it('GET returns items JSON', async () => {
    (container.makeListLeaderboardUseCase as jest.Mock).mockReturnValue({
      execute: async () => [{ name: 'A', score: 1, date: '2024-01-01T00:00:00.000Z' }]
    });

    const res = await getLeaderboard();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.items[0].name).toBe('A');
  });

  it('POST validates body and delegates to use case', async () => {
    const execute = jest.fn(async () => {});
    (container.makeSubmitScoreUseCase as jest.Mock).mockReturnValue({ execute });
    const req = new Request('http://test/leaderboard', {
      method: 'POST',
      body: JSON.stringify({ name: 'Thy', score: 7 })
    });
    const res = await postLeaderboard(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(execute).toHaveBeenCalledWith('Thy', 7);
  });

  it('POST rejects invalid payload', async () => {
    const req = new Request('http://test/leaderboard', {
      method: 'POST',
      body: JSON.stringify({ name: '', score: 'x' }) as any
    });
    const res = await postLeaderboard(req);
    expect(res.status).toBe(400);
  });
});
