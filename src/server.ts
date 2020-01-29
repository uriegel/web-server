import express from 'express'
import * as process from 'process'
import http from 'http'
import { google } from 'googleapis'

const app = express()

const dir = __dirname + '/..'

const googleConfig = {
clientId: '13016566844-c7nrdn3071nu9o7vi8pcii3si5utf60g.apps.googleusercontent.com', 
clientSecret: 'fN7FH0DWSYxSeCy1nv9nckcK', 
redirect: 'https://uriegel.de/auth' 
}

function createConnection() {
  return new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
  )
}

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  
  /**
   * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
   */
  function getConnectionUrl(auth: any) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      //scope: defaultScope
    });
  }
  
  /**
   * Create the google url to be sent to the client.
   */
  function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
  }

console.log('Connection', urlGoogle())

app.use('/auth', (req: express.Request, res: express.Response) => {
console.log("Aua", req)
    console.log(req.originalUrl);
    const email = req.originalUrl.substring(req.originalUrl.indexOf("email=") + 6)
    if (email.toLocaleLowerCase() == "uwriegel@gmail.com")
      res.sendStatus(200)    
    else
      res.sendStatus(403)    
})
app.use('/', express.static(dir))

http.createServer(app).listen(9865, () => console.log('Listening', dir))

console.log('Elektron', process.pid)

/**
 * Helper function to get the library with access to the google plus api.
 */
function getGooglePlusApi(auth: any) {
  return google.plus({ version: 'v1', auth });
}

/**
 * Extract the email and id of the google account from the "code" parameter.
 */
async function getGoogleAccountFromCode(code: string) {
  
  // get the auth "tokens" from the request
  const auth = createConnection();
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  
  // add the tokens to the google api so we have access to the account
  auth.setCredentials(tokens);
  
  // connect to google plus - need this to get the user's email
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: 'me' });
  
  // get the google id and email
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

  // return so we can login or sign up the user
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens, // you can save these to the user if you ever want to get their details without making them log in again
  };
}