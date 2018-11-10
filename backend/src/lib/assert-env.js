const required = [
  'PORT',
  'SECRET',
  'API_URL',
  'NODE_ENV',
  'CLIENT_URL',
  'MONGODB_URI',
  'CORS-ORIGINS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
]

try {
  required.forEach(key => {
    if (!process.env[key])
      throw new Error(`ENVIRONMENT ERROR: slugchat requires process.env.${key} to be set`)
  });
} catch (e) {
  console.error(e.message)
  process.exit(1)
}