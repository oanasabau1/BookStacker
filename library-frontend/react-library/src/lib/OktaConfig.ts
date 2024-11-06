export const OktaConfig = {
    clientId: '0oakx3e6id3uYNRBD5d7',
    issuer: 'https://dev-02703733.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    useClassicEngine: true
  };
  