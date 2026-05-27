import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'toolbazaar'

let clientPromise

export function isMongoConfigured() {
  return Boolean(uri)
}

function getClientPromise() {
  if (!uri) {
    throw new Error('MONGO_URL is not configured. Add it in your deployment environment variables.')
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
  return clientPromise
}

export async function getDb() {
  const cli = await getClientPromise()
  return cli.db(dbName)
}
