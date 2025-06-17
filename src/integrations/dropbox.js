import createService from './baseService';

const service = createService({
  name: 'dropbox',
  authUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
  baseUrl: 'https://api.dropboxapi.com/2/',
});

export default service;
