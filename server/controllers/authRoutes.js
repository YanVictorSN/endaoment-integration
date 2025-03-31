const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function toUrlSafe(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function generateCodeVerifier() {
  const randomBytes = crypto.randomBytes(32);
  crypto.getRandomValues(randomBytes);
  return toUrlSafe(Buffer.from(randomBytes).toString('base64'));
}

async function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256');
  hash.update(codeVerifier);
  return toUrlSafe(hash.digest('base64'));
}

function saveOAuthState({ codeVerifier, codeChallenge, state }) {
  fs.writeFileSync(
    path.join(__dirname, `${state}-exportedVariables.json`),
    JSON.stringify(
      {
        codeVerifier,
        codeChallenge,
        state,
      },
      null,
      2
    )
  );
}

function getOAuthState(stateFromUrl) {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `${stateFromUrl}-exportedVariables.json`),
      'utf8'
    )
  );
}


async function initLogin(req, res) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const state = crypto.randomBytes(16).toString('hex');

  saveOAuthState({
    codeVerifier,
    codeChallenge,
    state,
  });

  const staticUrl = 'https://auth.dev.endaoment.org/auth';
  const redirectUri = 'http://localhost:5454';
  
  const urlParams = new URLSearchParams();
  urlParams.append('response_type', 'code');
  urlParams.append('prompt', 'consent');
  urlParams.append(
    'scope',
    'openid offline_access accounts transactions profile'
  );
  urlParams.append('client_id', process.env.ENDAOMENT_CLIENT_ID);
  urlParams.append('redirect_uri', redirectUri);
  urlParams.append('code_challenge', codeChallenge);
  urlParams.append('code_challenge_method', 'S256');
  urlParams.append('state', state);

  const urlToRedirect = `${staticUrl}?${urlParams
    .toString()
    .replace(/\+/g, '%20')}`;
  
  res.json({ url: urlToRedirect });
  res.end();
}

async function verifyLogin(req, res) {
  try {
    // Get the state and code from the URL
    console.log('Query:', req.query);
    const stateFromUrl = req.query['state'];
    const code = req.query['code'];

    // Get the exported variables that were stored when the login was initiated
    const exportedVariables = getOAuthState(stateFromUrl);

    // Prepare the URL to exchange the code for an authentication token
    // The Endaoment endpoint
    const staticUrl = 'https://auth.dev.endaoment.org/token';

    // Replace this value with your own
    // It is used to validate that the call for token has the same redirectUrl as the call that initiates auth
    // This should match the redirectUri used in the previous step
    const redirectUri = 'http://localhost:5454';

    // Prepare form data using URLSearchParams
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('code_verifier', exportedVariables.codeVerifier);
    formData.append('redirect_uri', redirectUri);

    // Send the request to the Endaoment OAuth token endpoint
    const tokenResponse = await fetch(staticUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.ENDAOMENT_CLIENT_ID}:${process.env.ENDAOMENT_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: formData,
    });

    // Verifica se a resposta foi bem-sucedida
    if (!tokenResponse.ok) {
      throw new Error('Falha na obtenção do token');
    }

    // Parse the token response
    const tokenData = await tokenResponse.json();

    try {
      fs.unlinkSync(path.join(__dirname, `${stateFromUrl}-exportedVariables.json`));
    } catch (fileError) {
      console.warn('Could not delete state file:', fileError);
    }

    const frontendRedirectUrl = `http://localhost:3000/callback?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}`;
    res.redirect(frontendRedirectUrl);
  } catch (error) {
    console.error('Login Verification Error:', error);
    res.redirect(`http://localhost:3000/login-error?message=${encodeURIComponent(error.message)}`);
  }
}

module.exports = { initLogin, verifyLogin };