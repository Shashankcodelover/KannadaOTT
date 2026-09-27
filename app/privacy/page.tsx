import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl text-white">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-4">Last updated: September 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>We do not collect personal information unless you explicitly provide it to us through our contact forms or account creation process.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Cookies and Analytics</h2>
        <p>We may use basic analytics to understand how visitors interact with our platform. No personally identifiable information is tracked.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p>We take reasonable measures to protect your information. However, no internet transmission is completely secure.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
        <p>If you have any questions, please contact us at support@shashankj.tech.</p>
      </section>
    </main>
  );
}
