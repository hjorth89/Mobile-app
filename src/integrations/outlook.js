import createService from './baseService';

const service = createService({
  name: 'outlook',
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  baseUrl: 'https://graph.microsoft.com/v1.0/',
});

export default service;
