# auth0
Pure JavaScript (client side) Google Identity web authorization library.

# Method
- isAuthenticated() `bool` : Returns `true` if user has previously signed in.
- authenticate() `promise`: Execute authorization flow (popup). Returns promise with fulfilled only state.
- getAccessToken() `string` : Get access token
- revoke() : Delete authorization data (access token, email hint, token expiration). Not actually revoking the token.

# Initialization
Configure your client.
```js
window.auth0.configure({
  clientId: 'xxxxx.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
});
```

# Usage Examples
Example 1 : Invoking authorization flow.
```html
<button onclick="login()"> Login </button>

<script>
  function login() {
    window.auth0.authenticate().then(() => onAuthReady());
  }

  function onAuthReady() {
    // todo
  }
</script>
```

Example 2 : Execute authorized process on application start. User must previously signed in.
```js
if (window.auth0.isAuthenticated()) {
  window.auth0.authenticate().then(() => onAuthReady());
}

function onAuthReady() {
  // todo
}
```

Example 3 : Intercepting any request that require access token.
```js
async function exampleRequest() {

  // intercept request, check token validity and
  // execute authorization flow if token is expired
  await window.auth0.authenticate();
  
  let options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + window.auth0.getAccessToken(), // retrieve access token
      'Content-Type': 'application/json'
    }
  };
  
  fetch(url, options)
  .then(response => {
    ...
  })
  
}
```


# Articles
- [Authorizing for Web](https://developers.google.com/identity/oauth2/web/guides/overview)
