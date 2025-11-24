import express from 'express';
import { requireAuth } from '#middlewares';
import apply from './apply.js';
import bucket from './bucket.js';
import loan from './loan.js';
import loans from './list.js';
import loansJoined from './list_joined.js';

const rt = express.Router();

rt.get('/', requireAuth, loans);
rt.post('/', requireAuth, apply);
rt.get('/joined', requireAuth, loansJoined);
rt.get('/bucket', requireAuth, bucket);
rt.get('/:id', requireAuth, loan);

export default rt;