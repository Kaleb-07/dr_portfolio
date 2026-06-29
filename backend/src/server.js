const express = require('express')
const cors = require('cors')
const path = require('path')
const cmsRoutes = require('./cms/routes')
const authRoutes = require('./routes/auth.routes')
const uploadRoutes = require('./routes/upload')
const contactRoutes = require('./routes/contact.routes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '25mb' }))

app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')))

app.use('/api/cms', cmsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/impact', require('./routes/impact.routes'))

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CMS Backend Running 🚀' })
})

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
