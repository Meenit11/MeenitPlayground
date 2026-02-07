import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const imagesDir = path.join(publicDir, 'images')
const dataDir = path.join(publicDir, 'data')

// Ensure directories exist
[publicDir, imagesDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

// Copy images from /images to /public/images
const imagesSource = path.join(rootDir, 'images')
if (fs.existsSync(imagesSource)) {
  fs.readdirSync(imagesSource).forEach(file => {
    const src = path.join(imagesSource, file)
    const dest = path.join(imagesDir, file)
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest)
    }
  })
}

// Copy data files to public for client fetch
const dataFiles = ['words.json', 'questions.json']
dataFiles.forEach(file => {
  const src = path.join(rootDir, file)
  const dest = path.join(dataDir, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
  }
})

console.log('Assets copied successfully!')
