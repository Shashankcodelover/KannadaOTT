import React from 'react';

export default function TermsOfService() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl text-white">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="mb-4">Last updated: September 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing this platform, you agree to be bound by these terms of service and all applicable laws and regulations.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
        <p>You may use this platform for personal, non-commercial viewing. This is a license, not a transfer of title.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Content Accuracy</h2>
        <p>While we strive for accuracy, movie links and metadata are subject to change. We do not guarantee the completeness or reliability of the information.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
        <p>In no event shall we be liable for any damages arising out of the use or inability to use this platform.</p>
      </section>
    </main>
  );
}
