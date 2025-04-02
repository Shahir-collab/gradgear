module.exports = {
    app: {
      port: process.env.PORT || 5000,
      jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
      jwtExpiration: '24h',
    },
    db: {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'gradegear',
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
    }
  };