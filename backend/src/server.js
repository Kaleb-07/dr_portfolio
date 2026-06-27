const express = require('express')
const cors = require('cors')
const cmsRoutes = require('./cms/routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '25mb' }))

// Mount CMS routes
app.use('/api/cms', cmsRoutes)

// Mount auth routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CMS Backend Running 🚀' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '127.0.0.1'

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
