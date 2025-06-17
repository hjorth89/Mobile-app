import createService from './baseService';

const service = createService({
  name: 'slack',
  authUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  baseUrl: 'https://slack.com/api/',
});

export default service;
