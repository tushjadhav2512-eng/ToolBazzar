export const metadata = { title: 'Privacy Policy', description: 'Privacy Policy for ToolBazaar' }

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Our Privacy Commitment</h2>
      <p>ToolBazaar is built on a privacy-first foundation. All of our tools run entirely on your device using your browser. We do not upload, store, or have access to any of the files or data you process with our tools.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Data Collection</h2>
      <p>We may use anonymous analytics (like page views) to understand how the website is used. This data does not personally identify you and does not include the content of any files or data you process.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Cookies</h2>
      <p>ToolBazaar may use cookies for theme preferences and basic analytics. You can disable cookies in your browser settings at any time.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Advertising</h2>
      <p>We may display third-party advertisements (like Google AdSense). These services may use cookies to serve relevant ads. Please refer to those providers’ privacy policies for more information.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">Contact</h2>
      <p>Questions about this policy? Visit our <a href="/contact" className="text-primary underline">contact page</a>.</p>
    </div>
  )
}
