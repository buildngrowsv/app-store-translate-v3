import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-8">
          Last updated: March 15, 2024
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            ReachMix ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our app store optimization and translation services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email address, password)</li>
            <li>App store content and descriptions</li>
            <li>Translation preferences and language selections</li>
            <li>Usage data and interaction with our services</li>
            <li>Payment information (processed securely through our payment providers)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services</li>
            <li>To process your translations and optimizations</li>
            <li>To communicate with you about your account and services</li>
            <li>To send important updates and notifications</li>
            <li>To analyze and improve our service performance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes for which we collected it, including for legal, accounting, or reporting requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request transfer of your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p>
            We may use third-party services for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment processing</li>
            <li>Analytics</li>
            <li>Email communications</li>
            <li>Cloud infrastructure</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our practices, please contact us at:
          </p>
          <p className="mt-2">
            Email: buildngrowsv@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};