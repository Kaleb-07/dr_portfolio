// scripts/fetch-cms-content.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CMS_URL = process.env.CMS_API_URL || 'http://localhost:5000/api'
const API_KEY  = process.env.CMS_API_KEY || ''

async function main() {
  console.log(`🔵 Fetching CMS content from ${CMS_URL}/cms/site-content`)

  const headers = { 'Content-Type': 'application/json' }
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`

  const res = await fetch(`${CMS_URL}/cms/site-content`, { headers })
  if (!res.ok) throw new Error(`CMS returned ${res.status} ${res.statusText}`)

  const data = await res.json()

  const outPath = path.join(__dirname, '..', 'src', 'data', 'cms-content.ts')
  const content = `// Auto-generated from CMS – DO NOT EDIT
// Generated: ${new Date().toISOString()}
export const cmsContent = ${JSON.stringify(data, null, 2)};
`

  fs.writeFileSync(outPath, content, 'utf-8')
  console.log(`✅ CMS content written to src/data/cms-content.ts`)
}

main().catch(err => {
  console.error('❌ Failed to fetch CMS content:', err.message)
  process.exit(1)
})