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

export const setRefreshCookie = (res, token, uid) => {
  const opts = {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
  res.cookie('refreshToken', token, opts);
  res.cookie('uid', uid, opts);
};

export const rotateRefresh = async (userId) => {
  const refresh = newRandomToken();
  const hashed = await hash(refresh);
  await pool.query(
    'UPDATE users SET refresh_token=$1 WHERE id=$2',
    [hashed, userId]
  );
  return refresh;
}

export const getUserById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE mobile=$1 OR email=$1 LIMIT 1',
    [id]
  );
  return rows[0];
}
