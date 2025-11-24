import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from '#config';

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function newRandomToken() {
  return crypto.randomBytes(64).toString('hex');
}

export async function hash(str) {
  return await bcrypt.hash(str, 10);
}

export async function compare(raw, hashed) {
  return await bcrypt.compare(raw, hashed);
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'localhost', //'smtp.gmail.com',
  port: 1025, //587,
  ignoreTLS: true,
  /*
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  */
});

export async function sendResetLink(toEmail, link) {
  await transporter.sendMail({
    from: '"KopaPath" <no-reply@yourapp.com>',
    to: toEmail,
    subject: 'Reset Your Secret',
    html: `
      <p>Hi,</p>
      <p>Click the link below to reset your secret:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
}

export async function sendMsg(userId, msg) {
  const res = await pool.query(
    'INSERT INTO messages(user_id, msg) VALUES($1, $2) RETURNING id',
    [userId, msg]
  );
  return res.rows.length !== 0;
}