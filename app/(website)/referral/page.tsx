import { Section } from '@/components/Section';
import Link from 'next/link';

export const metadata = {
  title: 'Referral Program | Long Life',
  description: 'Earn rewards by sharing Long Life with friends. Get discounts for every successful referral!',
};

export default function ReferralProgramPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Share the Benefits
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Love Long Life? Share it with friends and earn rewards for every successful referral.
          </p>
          <Link
            href="/account#referrals"
            className="inline-block px-8 py-4 bg-accent-primary text-white font-semibold rounded-full hover:bg-accent-dark transition-all shadow-lg hover:shadow-xl"
          >
            Get Your Referral Link
          </Link>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-accent-primary">1</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Share Your Link</h3>
              <p className="text-gray-600">
                Get your unique referral link from your account dashboard and share it with friends.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-accent-primary">2</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Friend Signs Up</h3>
              <p className="text-gray-600">
                When your friend creates an account using your link, they'll get a welcome discount.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-accent-primary">3</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Earn Rewards</h3>
              <p className="text-gray-600">
                After their first purchase, you both receive rewards that can be used on future orders.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Rewards Breakdown */}
      <Section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Rewards Breakdown
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For You */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-heading text-2xl font-bold mb-4 text-accent-primary">
                For You
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>15% discount credit on your next order when your friend makes their first purchase</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Credits automatically applied to your account</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No limit on referrals - earn unlimited rewards</span>
                </li>
              </ul>
            </div>

            {/* For Your Friend */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-heading text-2xl font-bold mb-4 text-accent-secondary">
                For Your Friend
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10% off their first order as a welcome gift</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automatic discount at checkout - no code needed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to premium cold-pressed juices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="group bg-white p-6 rounded-xl shadow-md">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                How do I get my referral link?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Sign in to your account and navigate to the referrals section. Your unique referral link will be displayed there along with tracking stats.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl shadow-md">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                When do I receive my rewards?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Your reward credits are issued within 24 hours after your referred friend completes their first purchase. Credits are automatically applied to your account.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl shadow-md">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                Is there a limit to how many people I can refer?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                No! Refer as many friends as you'd like. There's no cap on the number of referrals or rewards you can earn.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl shadow-md">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                How do my friends use their discount?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                When they sign up using your referral link, their discount is automatically tracked. It will be applied automatically at checkout on their first purchase.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl shadow-md">
              <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                Can I combine referral credits with other discounts?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Referral credits can typically be stacked with most promotions, but cannot be combined with other referral discounts or certain limited-time offers. Check the specific terms at checkout.
              </p>
            </details>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-br from-accent-primary to-accent-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your unique referral link and start sharing the benefits of Long Life with your friends.
          </p>
          <Link
            href="/account#referrals"
            className="inline-block px-8 py-4 bg-white text-accent-primary font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Access Your Referrals Dashboard
          </Link>
        </div>
      </Section>
    </>
  );
}
