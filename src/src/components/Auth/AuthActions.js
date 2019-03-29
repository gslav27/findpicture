import auth0 from 'auth0-js';
import { history } from '../../store/store';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'gslav27.auth0.com',
    clientID: 'DpB5RTrcAl4DMJWvaxBM15dPX06FlFa2',
    redirectUri: 'http://localhost:3000/findpicture/callback',
    // redirectUri: 'http://gslav27.github.io/findpicture/callback',
    audience: 'https://gslav27.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid email',
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/findpicture');
      } else if (err) {
        history.replace('/findpicture');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('findpicture_access_token', authResult.accessToken);
    localStorage.setItem('findpicture_id_token', authResult.idToken);
    localStorage.setItem('findpicture_expires_at', expiresAt);
    localStorage.setItem('findpicture_user', authResult.idTokenPayload.email);
    // navigate to the home route
    history.replace('/findpicture');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('findpicture_access_token');
    localStorage.removeItem('findpicture_id_token');
    localStorage.removeItem('findpicture_expires_at');
    localStorage.removeItem('findpicture_user');
    localStorage.removeItem('findpicture_userID');
    // navigate to the home route
    history.replace('/findpicture');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('findpicture_expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
