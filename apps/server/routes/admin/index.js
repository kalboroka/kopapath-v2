import express from 'express';
import { requireAuth } from '#middlewares';
import mark_status from './mark_status.js';
import send_msg from './send_msg.js';
import broadcast_msg from './broadcast_msg.js';
import update_bucket from './update_bucket.js';

const rt = express.Router();
rt.use(requireAuth);
rt.post('/messages/send', send_msg);
rt.post('/messages/broadcast', broadcast_msg);
rt.post('/bucket/update', update_bucket);
rt.patch('/loans/mark/:id', mark_status);

export default rt;
