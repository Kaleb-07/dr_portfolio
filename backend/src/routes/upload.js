const express = require('express')
const multer = require('multer')
const path = require('path')
const { verifyToken } = require('../middleware/auth.middleware') // FIXED import

const router = express.Router()

// --------------- multer configuration ---------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to backend/public/uploads
    cb(null, path.join(__dirname, '../../public/uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/
  const extname = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowed.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

// --------------- routes ---------------
router.post('/', verifyToken, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(400).json({ error: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }
    const url = `/uploads/${req.file.filename}`
    res.json({ url })
  })
})

module.exports = router
