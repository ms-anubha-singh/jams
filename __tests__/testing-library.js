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
});

const fetchAllData = () => ({
  adminId: 'auth0|614c41b3de45d300692bc589',
  isOpen: true,
  createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
  description: 'How well can you folk',
  urlPath: 's6p1qv76bxg',
  name: 'Folk Jam',
  key: 'hZLVrK2lhig19cbLuMBx',
});

const fetchDataNoAdminToken = () => ({
  isOpen: true,
  createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
  description: 'How well can you folk',
  urlPath: 's6p1qv76bxg',
  name: 'Folk Jam',
  key: 'hZLVrK2lhig19cbLuMBx',
});

const fetchDataInvalidAdmin = () => ({
  adminId: 'blahblahblah',
  isOpen: true,
  createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
  description: 'How well can you folk',
  urlPath: 's6p1qv76bxg',
  name: 'Folk Jam',
  key: 'hZLVrK2lhig19cbLuMBx',
});

// NEWly added
describe('Testing api for getting a jam:', () => {
  it('with admin token', async () => {
    const fakeData = {
      adminId: 'auth0|614c41b3de45d300692bc589',
      isOpen: true,
      createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
      description: 'How well can you folk',
      urlPath: 's6p1qv76bxg',
      name: 'Folk Jam',
      key: 'hZLVrK2lhig19cbLuMBx',
    };

    const data = await fetchAllData();
    expect(data).toStrictEqual(fakeData);
  });

  it('without admin token', async () => {
    const fakeData = {
      isOpen: true,
      createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
      description: 'How well can you folk',
      urlPath: 's6p1qv76bxg',
      name: 'Folk Jam',
      key: 'hZLVrK2lhig19cbLuMBx',
    };

    const data = await fetchDataNoAdminToken();
    expect(data).toStrictEqual(fakeData);
  });

  it('invalid admin token', async () => {
    const fetchData = {
      adminId: 'blah_blah_blah_invalid_admin_token',
      isOpen: true,
      createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
      description: 'How well can you folk',
      urlPath: 's6p1qv76bxg',
      name: 'Folk Jam',
      key: 'hZLVrK2lhig19cbLuMBx',
    };

    const data = await fetchDataInvalidAdmin();
    expect(data).toStrictEqual(fetchData);
  });
});
