export const metadata = { title: 'About ToolBazaar', description: 'About ToolBazaar — free online tools for everyone.' }

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-6">About ToolBazaar</h1>
      <p className="text-lg text-muted-foreground">ToolBazaar is a collection of 30+ free online utility tools built to make everyday digital tasks faster and easier.</p>
      <p className="text-sm text-muted-foreground mt-2">Owned & operated by <strong className="text-foreground">Tushar Jadhav</strong>.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Our Mission</h2>
      <p>We believe powerful productivity tools should be free, accessible, and respect your privacy. That’s why every tool on ToolBazaar runs entirely in your browser — no servers, no uploads, no tracking.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">What We Offer</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>PDF tools — merge, split, compress, convert</li>
        <li>Image tools — resize, compress, convert formats</li>
        <li>Text tools — counter, formatter, comparison</li>
        <li>Generators — QR codes, barcodes, passwords</li>
        <li>Calculators — EMI, SIP, BMI, GST and more</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-3">Why ToolBazaar?</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>100% Free</strong> — no subscriptions, no hidden fees</li>
        <li><strong>No Signup</strong> — jump in and start using tools instantly</li>
        <li><strong>Privacy First</strong> — your data never leaves your device</li>
        <li><strong>Mobile Friendly</strong> — use on any device, anywhere</li>
      </ul>
    </div>
  )
}
