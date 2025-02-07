import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
      
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-8">
          Last updated: March 15, 2024
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using ReachMix's services, you agree to be bound by these Terms of Use. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            ReachMix provides AI-powered app store optimization and translation services. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>App store description generation and optimization</li>
            <li>Multi-language translation services</li>
            <li>Keyword optimization tools</li>
            <li>Analytics and performance tracking</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Free Trial</h2>
          <p>
            The free trial includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Up to 3 projects</li>
            <li>Translation into up to 3 languages per project</li>
            <li>Basic ASO optimization features</li>
            <li>14-day access to basic features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Subscription Terms</h2>
          <p>
            Subscription plans and billing:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Starter: $29/month
              <ul className="pl-6 mt-2">
                <li>Up to 10 projects</li>
                <li>Up to 10 languages per project</li>
                <li>Basic ASO optimization</li>
                <li>Standard support</li>
              </ul>
            </li>
            <li>Pro: $79/month
              <ul className="pl-6 mt-2">
                <li>Up to 25 projects</li>
                <li>Up to 25 languages per project</li>
                <li>Advanced ASO optimization</li>
                <li>Priority support</li>
                <li>Custom keywords</li>
              </ul>
            </li>
            <li>Enterprise: Custom pricing
              <ul className="pl-6 mt-2">
                <li>Unlimited projects</li>
                <li>Unlimited languages</li>
                <li>Premium ASO optimization</li>
                <li>Dedicated support</li>
                <li>Custom integration</li>
                <li>API access</li>
              </ul>
            </li>
          </ul>
          <p className="mt-4">
            Subscriptions are billed in advance on a monthly basis. You can cancel your subscription at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
          <p>
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring your content doesn't violate any laws or rights</li>
            <li>Providing accurate information for your app store listings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p>
            You retain all rights to your original content. By using our service, you grant us a license to process and translate your content as necessary to provide our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            ReachMix is provided "as is" without warranties of any kind. We are not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>App store approval or rejection decisions</li>
            <li>Translation accuracy beyond reasonable efforts</li>
            <li>Third-party services or links</li>
            <li>Loss of data or profits</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            Email: buildngrowsv@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};