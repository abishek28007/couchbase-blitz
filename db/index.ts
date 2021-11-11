import { connect } from "couchbase"

const COUCHBASE_USER = process.env.COUCHBASE_USER
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD
const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT || "localhost"
const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET || "local"
let IS_CLOUD_INSTANCE = process.env.IS_CLOUD_INSTANCE || "false"

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents duplicate connections during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

async function getCluster() {
  if (cached.conn) {
    return cached.conn
  }

  cached.conn = await connect(
    "couchbase://" +
      COUCHBASE_ENDPOINT +
      (IS_CLOUD_INSTANCE === "true" ? "?ssl=no_verify&console_log_level=5" : ""),
    {
      username: COUCHBASE_USER,
      password: COUCHBASE_PASSWORD,
    }
  )

  return cached.conn
}

async function connectToDatabase() {
  const cluster = await getCluster()
  const bucket = cluster.bucket(COUCHBASE_BUCKET)
  return {
    cluster,
    bucket,
  }
}

let couchdb = connectToDatabase()
export default couchdb
