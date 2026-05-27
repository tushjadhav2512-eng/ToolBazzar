const fs = require('fs')
const path = require('path')

const source = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs')
const targetDir = path.join(__dirname, '..', 'public')
const target = path.join(targetDir, 'pdf.worker.min.mjs')

if (!fs.existsSync(source)) {
  console.warn('PDF.js worker was not found. Run install again after dependencies are available.')
  process.exit(0)
}

fs.mkdirSync(targetDir, { recursive: true })
fs.copyFileSync(source, target)
console.log('Copied PDF.js worker to public/pdf.worker.min.mjs')
