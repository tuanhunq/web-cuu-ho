require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  sqlserver: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 1433,
    database: process.env.DB_NAME || 'rescue',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  },
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  },
  bcrypt: {
    saltRounds: 10
  },
  rescue: {
    maxDistance: 10000, // meters
    defaultSearchRadius: 5000 // meters
  }
};