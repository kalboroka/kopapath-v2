import express from 'express';
import { requireAuth } from '#middlewares';
import signup from './signup.js';
import login from './login.js';
import { login as admin_login } from '#routes/admin';
import logout from './logout.js';
import refresh_token from './refresh_token.js';
import reset_secret from './reset_secret.js';
import confirm_reset from './confirm_reset.js';

const rt = express.Router();

rt.post('/signup', signup);
rt.post('/admin/login', admin_login);
rt.post('/login', login);
rt.post('/logout', requireAuth, logout);
rt.post('/refresh', refresh_token);
rt.post('/reset', reset_secret);
rt.post('/confirm', confirm_reset);

export default rt;
