import express from 'express';
import signup from './signup.js';
import login from './login.js';
import logout from './logout.js';
import refresh_token from './refresh_token.js';
import reset_secret from './reset_secret.js';
import confirm_reset from './confirm_reset.js';

const rt = express.Router();

rt.post('/signup', signup);
rt.post('/login', login);
rt.post('/logout', logout);
rt.post('/refresh', refresh_token);
rt.post('/reset', reset_secret);
rt.post('/confirm', confirm_reset);

export default rt;
