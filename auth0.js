window.auth0 = (function () {
  
  let SELF = {};
  let client;
  let authData = {
    email: '',
    token: '',
    exp: 0,
  };

  let storageKey = 'auth0-NDUxMTg1MA';
  let scopes = [];
  let clientId;
  let requestQueueResolver = [];
  
  SELF.configure = function(config) {
    clientId = config.clientId;
    scopes = config.scopes;
    let storageAuthData = localStorage.getItem(storageKey);
    if (storageAuthData) {
      authData = JSON.parse(storageAuthData);
      authData.exp = parseInt(authData.exp);
    }
  };
  
  SELF.isAuthenticated = function() {
    return authData.exp > 0;
  };
  
  SELF.authenticate = function() {
    return new Promise(resolve => {
      if (authData.exp - new Date().getTime() > 0) {
        resolve();
        return;
      }
      if (!client) {
        initClient();
      }
      if (requestQueueResolver.length == 0) {
        requestToken();
      }
      requestQueueResolver.push(resolve);
    });
  };
  
  SELF.getAccessToken = function() {
    return authData.token;
  };
  
  function resolveAll() {
    for (let i=0; i<requestQueueResolver.length; i++) {
      let resolve = requestQueueResolver[i];
      resolve();
    }
    requestQueueResolver.length = 0;
  }
  
  function initClient() {
    client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes.join(' '),
      prompt: '',
      callback: (response) => {
        authData.token = response.access_token;
        storeData();
        getTokenUserInfo(response.access_token);
      },
    });
  }
  
  SELF.revoke = function() {
    localStorage.removeItem(storageKey);
    authData = {
      email: '',
      token: '',
      exp: 0,
    };
  };
  
  function storeData() {
    localStorage.setItem(storageKey, JSON.stringify(authData));
  }
  
  function getTokenUserInfo(token) {
    fetch('https://www.googleapis.com/oauth2/v3/tokeninfo', {
      headers: {authorization:'Bearer '+token}
    })
    .then(r => r.json())
    .then((data) => {
      authData.exp = (parseInt(data.expires_in) - 120) * 1000 + new Date().getTime();
      authData.email = data.email;
      storeData();
      resolveAll();
    });
  }
  
  function requestToken() {
    client.requestAccessToken({
      hint: authData.email
    });
  }
  
  return SELF;
  
})();
