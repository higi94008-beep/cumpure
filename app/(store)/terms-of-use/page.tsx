export default function TermsOfUsePage() {
  return (
    <div className="container-custom py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-gray-400 text-sm mb-8">Effective date: January 1, 2026</p>

      <div className="space-y-8">
        {[
          { title: '1. Acceptance of Terms', body: "By accessing or using Nature's Harvest, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our platform." },
          { title: '2. Account Registration', body: "You may browse our store without creating an account, but to place orders you must register with accurate, current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
          { title: '3. Product Information', body: "We make every effort to display accurate product information, including descriptions, images, and pricing. However, we do not warrant that product descriptions or prices are accurate, complete, or error-free. We reserve the right to correct errors and cancel orders placed based on incorrect information." },
          { title: '4. Orders and Payment', body: "Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order. Payment must be made in full at the time of ordering. We accept major credit/debit cards, UPI, and net banking. All prices are in Indian Rupees and include applicable taxes." },
          { title: '5. Delivery', body: "We deliver to select pin codes. Delivery timelines are estimates and may vary due to factors outside our control. Risk of loss passes to you upon delivery. For issues with delivery, contact our support team within 24 hours of the scheduled delivery time." },
          { title: '6. Returns and Refunds', body: "We offer a 7-day return policy for most products. Items must be returned in their original condition and packaging. Perishable items are not eligible for return unless they are defective or damaged. Refunds are processed within 7 business days of receiving the returned item." },
          { title: '7. Intellectual Property', body: "All content on Nature's Harvest, including text, images, logos, and software, is the property of Nature's Harvest or its content suppliers and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without explicit written permission." },
          { title: '8. Limitation of Liability', body: "To the maximum extent permitted by law, Nature's Harvest shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or products purchased through it." },
        ].map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
