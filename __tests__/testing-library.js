/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import Index from '../pages/index';
import client from 'next-auth/client';
import '@testing-library/jest-dom';

jest.mock('next-auth/client');

beforeAll(() => {
  const mockSession = {
    expires: '1',
    user: { email: 'jam', name: 'jam' },
  };

  client.useSession.mockReturnValueOnce([mockSession, false]);

  jest.spyOn(window, 'fetch').mockImplementation(() => {});
});

describe('App', () => {
  it('renders a heading', () => {
    const { getByRole } = render(<Index />);

    const heading = getByRole('heading', {
      name: /welcome to jam/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('adding a test jest', () => {
    const fakeData = {
      name: 'fake name',
    };

    expect(fakeData).toEqual({ name: 'fake name' });
  });
});
