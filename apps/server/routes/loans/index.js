import express from 'express';
import { requireAuth } from '#middlewares';
import apply from './apply.js';
import bucket from './bucket.js';
import loan from './loan.js';
import loans from './list.js';
import loansJoined from './list_joined.js';

const rt = express.Router();

rt.use(requireAuth);
rt.get('/', loans);
rt.post('/', apply);
rt.get('/joined', loansJoined);
rt.get('/bucket', bucket);
rt.get('/:id', loan);

export default rt;