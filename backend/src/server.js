const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

/* ---------------- ROUTES ---------------- */
const heroRoutes = require('./routes/hero.routes')
const authRoutes = require('./routes/auth.routes')
const cmsRoutes = require('./routes/cms.routes')

app.use('/api/hero', heroRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cms', cmsRoutes)

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
  res.send('CMS Backend Running 🚀')
})

/* ---------------- START SERVER ---------------- */
const PORT = 5000

cmsRoutes
  .initCmsSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('CMS schema initialization failed:', error)
    process.exit(1)
  })
