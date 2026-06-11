export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: June 1, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        {[
          { title: '1. Information We Collect', body: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes name, email address, phone number, delivery address, and payment information (processed securely through our payment partners). We also collect information automatically when you use our platform, including browsing behaviour, device information, and IP address." },
          { title: '2. How We Use Your Information', body: "We use your information to process and deliver your orders, communicate with you about your account and orders, send promotional offers (with your consent), improve our services and personalise your experience, prevent fraud, and comply with legal obligations. We do not sell your personal data to third parties." },
          { title: '3. Information Sharing', body: "We share your information only as necessary: with logistics partners to deliver your orders, with payment processors to handle transactions, with technology service providers who help us operate our platform, and when required by law or legal process. All third parties we work with are contractually obligated to protect your data." },
          { title: '4. Data Retention', body: "We retain your account information for as long as your account is active and for a reasonable period thereafter. Order information is retained for 7 years for legal and accounting purposes. You may request deletion of your personal data at any time, subject to legal retention requirements." },
          { title: '5. Your Rights', body: "You have the right to access the personal data we hold about you, correct inaccurate data, request deletion of your data, opt out of marketing communications at any time, and lodge a complaint with a data protection authority. To exercise these rights, contact us at privacy@naturesharvest.in." },
          { title: '6. Cookies', body: "We use cookies to keep you signed in, remember your cart, and understand how you use our site. You can control cookies through your browser settings, though some features may not work correctly without them." },
          { title: '7. Security', body: "We implement industry-standard security measures including encryption, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure, and we encourage you to protect your account with a strong, unique password." },
          { title: '8. Contact Us', body: "If you have questions about this Privacy Policy or our data practices, contact our Privacy Team at privacy@naturesharvest.in or write to us at Nature's Harvest, 15 Turner Road, Bandra West, Mumbai — 400050." },
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
