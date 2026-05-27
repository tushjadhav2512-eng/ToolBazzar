import crypto from 'crypto'
import { getDb } from './mongo'
import { v4 as uuidv4 } from 'uuid'

const SECRET = process.env.AUTH_SECRET || 'dev-secret'
const SESSION_DAYS = 30

export function signValue(value) {
  const sig = crypto.createHmac('sha256', SECRET).update(value).digest('hex')
  return `${value}.${sig}`
}

export function verifyValue(signed) {
  if (!signed) return null
  const idx = signed.lastIndexOf('.')
  if (idx < 0) return null
  const value = signed.slice(0, idx)
  const sig = signed.slice(idx + 1)
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex')
  if (sig !== expected) return null
  return value
}

export async function createSession(email) {
  const db = await getDb()
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000)
  await db.collection('sessions').insertOne({ token, email, createdAt: new Date(), expiresAt })
  return signValue(token)
}

export async function getSession(signedToken) {
  const token = verifyValue(signedToken)
  if (!token) return null
  const db = await getDb()
  const session = await db.collection('sessions').findOne({ token })
  if (!session) return null
  if (session.expiresAt < new Date()) {
    await db.collection('sessions').deleteOne({ token })
    return null
  }
  return { email: session.email, token }
}

export async function deleteSession(signedToken) {
  const token = verifyValue(signedToken)
  if (!token) return
  const db = await getDb()
  await db.collection('sessions').deleteOne({ token })
}

export function validateAdminCredentials(email, password) {
  return email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() && password === process.env.ADMIN_PASSWORD
}
