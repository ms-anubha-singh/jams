jest.mock('../../../config/firebaseAdminConfig');

jest.mock('../utils/api/get-jam-by-url-path.js');

import { getJamByUrlPath } from 'utils/api/get-jam-by-url-path';

getJamByUrlPath.mockImplementation(() => Promise.resolve(testJam));

import getJam from '../jam';

const testJam = {
  adminId: 'auth0|614c41b3de45d300692bc589',
  isOpen: true,
  createdAt: '1 October 2021 at 19:19:43 PM UTC+1',
  description: 'How well can you folk',
  urlPath: 's6p1qv76bxg',
  name: 'Folk Jam',
  key: 'hZLVrK2lhig19cbLuMBx',
};

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

describe('get a jam by url path unit tests', () => {
  it('gets a jam by url path with no statements', async () => {
    const fakeGetJamRequest = {
      query: {
        jamUrlPath: 's6p1qv76bxg',
        includeStatements: false, // not including statements - dont need an admin token
      },
      method: 'GET',
    };

    const fakeResponse = {
      json: jest.fn(),
      status: jest.fn(),
      setHeader: jest.fn(),
    };

    const response = await getJam(fakeGetJamRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json',
    );
    expect(fakeResponse.json).toHaveBeenCalledWith(testJam);
  });
});

// write another test that actually requests statements with an admin token (provide admin token - pass)

// write final test that provides an invalid token but doesn't include statements - fail
