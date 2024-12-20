import {getInstallerInfo} from '../src/app/installer';
import {installerUrl} from '../src/constants/constants';
import {mockFetch} from './mocks';

describe('getInstallerInfo', () => {
  const defaultHeaders = {headers: {'Content-Type': 'application/json'}};

  beforeEach(() => {
    const response = {
      entries: [
        {
          'version': '1.2.0',
          'platform': 'macos',
          'type': 'dmg',
          'arch': 'universal',
          'url': 'https://downloads.ibmaspera.com/downloads/desktop/macos/1.2.0/stable/universal/ibm-aspera-sdk_1.2.0_macos.dmg'
        },
        {
          'version': '1.2.0',
          'platform': 'windows',
          'type': 'msi',
          'arch': 'x64',
          'url': 'https://downloads.ibmaspera.com/downloads/desktop/windows/1.2.0/stable/x64/ibm-aspera-sdk_1.2.0.msi'
        },
        {
          'version': '1.1.9',
          'platform': 'linux',
          'type': 'rpm',
          'arch': 'x64',
          'url': 'https://downloads.ibmaspera.com/downloads/desktop/linux/1.1.9/stable/x64/ibm-aspera-sdk_1.1.9.rpm'
        },
        {
          'version': '1.1.9',
          'platform': 'linux',
          'type': 'appimage',
          'arch': 'x64',
          'url': 'https://downloads.ibmaspera.com/downloads/desktop/linux/1.1.9/stable/x64/ibm-aspera-sdk_1.1.9.AppImage'
        }
      ]
    };
    (<any>global).fetch = mockFetch(response);
    console.warn = jest.fn();
  });

  test('called with no options fetches from downloads server by default', () => {
    getInstallerInfo().catch(() => {});
    expect(fetch).toHaveBeenCalledWith(`${installerUrl}/latest.json`, defaultHeaders);
  });

  test('called with no options returns results for specific platform', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {value : 'Macintosh'});
    const exp = [
      {
        'version': '1.2.0',
        'platform': 'macos',
        'type': 'dmg',
        'arch': 'universal',
        'url': 'https://downloads.ibmaspera.com/downloads/desktop/macos/1.2.0/stable/universal/ibm-aspera-sdk_1.2.0_macos.dmg'
      }
    ];
    const data = await getInstallerInfo();
    expect(data.entries).toEqual(exp);
  });

  test('called with all returns results for all platforms', async () => {
    const data = await getInstallerInfo({all: true});
    expect(data.entries.length).toBe(4);
  });

  test('called with endpoint', () => {
    getInstallerInfo({endpoint: 'https://aspera.us/aspera/sdk'}).catch(() => {});
    expect(fetch).toHaveBeenCalledWith('https://aspera.us/aspera/sdk/latest.json', defaultHeaders);
  });

  test('called with endpoint with trailing json file', () => {
    getInstallerInfo({endpoint: 'https://aspera.us/aspera/sdk/latest.json'}).catch(() => {});
    expect(fetch).toHaveBeenCalledWith('https://aspera.us/aspera/sdk/latest.json', defaultHeaders);
  });

  test('called with endpoint returns URLs relative to endpoint', async () => {
    const response = {
      entries: [
        {
          'version': '1.2.0',
          'platform': 'macos',
          'type': 'dmg',
          'arch': 'universal',
          'url': 'downloads/ibm-aspera-sdk_1.2.0_macos.dmg'
        },
        {
          'version': '1.2.0',
          'platform': 'windows',
          'type': 'msi',
          'arch': 'x64',
          'url': 'downloads/ibm-aspera-sdk_1.2.0.msi'
        },
        {
          'version': '1.1.9',
          'platform': 'linux',
          'type': 'rpm',
          'arch': 'x64',
          'url': 'downloads/ibm-aspera-sdk_1.1.9.rpm'
        },
        {
          'version': '1.1.9',
          'platform': 'linux',
          'type': 'appimage',
          'arch': 'x64',
          'url': 'downloads/ibm-aspera-sdk_1.1.9.AppImage'
        }
      ]
    };
    (<any>global).fetch = mockFetch(response);
    const data = await getInstallerInfo({endpoint: 'https://aspera.us/aspera/sdk', all: true});
    for (const entry of data.entries) {
      expect(entry.url.startsWith('https://aspera.us/aspera/sdk/downloads/ibm-aspera-sdk')).toBe(true);
    }
  });

  test('called with invalid endpoint rejects', () => {
    const response = {
      entries: [
        {
          'version': '1.2.0',
          'platform': 'macos',
          'type': 'dmg',
          'arch': 'universal',
          'url': 'downloads/ibm-aspera-sdk_1.2.0_macos.dmg'
        }
      ]
    };
    (<any>global).fetch = mockFetch(response);
    return expect(getInstallerInfo({endpoint: 'aspera.us'})).rejects.toMatchObject({error: true});
  });
});
