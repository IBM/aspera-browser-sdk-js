import {mockFetch} from './mocks';
import {asperaDesktop} from '../src';
import {isSafari} from '../src/helpers/helpers';
import {httpClient} from '../src/helpers/client/http-client';
import {safariClient} from '../src/helpers/client/safari-client';

const client: Client = isSafari() ? safariClient : httpClient;

let id = 0;

const getHeaders = () => {
  return {
    'content-type': 'application/json',
  };
};

const getMethod = () => {
  return 'POST';
};

const getBody = (method: string, params: any = {}) => {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method,
    params,
  });
};

const getExpectedRequest = (method: string, params: any = {}) => {
  id++;

  return {
    method: getMethod(),
    headers: getHeaders(),
    body: getBody(method, params),
  };
};

describe('request', () => {

  beforeEach(() => {
    (<any>global).fetch = mockFetch({});
  });

  const fakeData = {data: 'testing'};

  test('POST with no params should call url with no params', () => {
    client.request('fake');
    expect(fetch).toHaveBeenCalledWith(asperaDesktop.globals.desktopUrl, getExpectedRequest('fake'));
  });

  test('POST with params should call url with params', () => {
    client.request('fake', fakeData);
    expect(fetch).toHaveBeenCalledWith(asperaDesktop.globals.desktopUrl, getExpectedRequest('fake', fakeData));
  });
});
