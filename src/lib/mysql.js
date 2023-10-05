import mysql from 'mysql2/promise'

const createPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

export const query = async (query, params) => {
  const connection = await createPool.getConnection()
  try {
    const [rows] = await connection.query(query, params)
    return rows
  } catch (error) {
    console.error(error)
  } finally {
    connection.release()
  }
}
