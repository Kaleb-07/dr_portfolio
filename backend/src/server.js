const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

/* ---------------- ROUTES ---------------- */
const heroRoutes = require('./routes/hero.routes')
const authRoutes = require('./routes/auth.routes')

app.use('/api/hero', heroRoutes)
app.use('/api/auth', authRoutes)

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
  res.send('CMS Backend Running 🚀')
})

/* ---------------- START SERVER ---------------- */
const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
