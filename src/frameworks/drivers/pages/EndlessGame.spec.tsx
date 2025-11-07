/** @jest-environment jsdom */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import EndlessGame from './EndlessGame';

// Mock fetch globally
const originalFetch = global.fetch;

function mockFetchSequence(responses: any[]) {
  let i = 0;
  global.fetch = jest.fn(async () => responses[Math.min(i++, responses.length - 1)]) as any;
}

describe('EndlessGame page', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear?.();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders game and category after successful fetch', async () => {
    jest.useFakeTimers();
    mockFetchSequence([
      { ok: true, json: async () => ({ name: 'TEST', categorie: 'Cat' }) },
    ]);
    await act(async () => { render(<EndlessGame />); });
    // flush microtasks
    await act(async () => {});
    expect(screen.getByText(/Mode sans fin/i)).toBeInTheDocument();
    expect(screen.getByText(/Catégorie :/i)).toBeInTheDocument();
    expect(screen.getByText(/Cat/i)).toBeInTheDocument();
  });

  it('shows error message and retry button on fetch failure', async () => {
    mockFetchSequence([
      { ok: false, json: async () => ({}) },
    ]);
    await act(async () => { render(<EndlessGame />); });
    await act(async () => {});
    expect(screen.getByText(/Failed to fetch random word/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument();
  });
});
