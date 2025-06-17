import createService from './baseService';

const service = createService({
  name: 'google',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  baseUrl: 'https://www.googleapis.com/',
});

export default service;
