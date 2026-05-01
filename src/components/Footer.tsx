import React from 'react';
import {
  Download,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const qualityItems = [
    { icon: '✓', label: '30,000+ products' },
    { icon: '✓', label: '4,000+ brands' },
    { icon: '✓', label: 'Authentic products guaranteed' },
  ];

  const customerServiceLinks = [
    'Help Center',
    'Order Status',
    'Returns & Refunds',
    'Shipping Info',
    'Contact Us',
  ];

  const categoriesLinks = [
    'Supplements',
    'Sports',
    'Bath',
    'Beauty',
    'Grocery',
    'Vitamins',
  ];

  const programsLinks = [
    'Autoship & Save',
    'Rewards',
    'Loyalty Credits',
    'Refer a Friend',
  ];

  const companyLinks = [
    'About Us',
    'Careers',
    'Press',
    'Blog',
    'Sustainability',
  ];

  const legalLinks = ['Terms', 'Privacy', 'Accessibility'];

  return (
    <footer className="w-full bg-white">
      {/* Quality Promise Bar */}
      <div className="bg-slate-100 border-t-4 border-b-4 border-[#0A6B3C] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-[#0A6B3C]" />
              iHerb Quality Promise
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
            {qualityItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2 text-xs text-gray-700"
              >
                <span className="text-[#0A6B3C] font-bold">✓</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#212529] text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Customer Service */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">
                Customer Service
              </h4>
              <ul className="space-y-2">
                {customerServiceLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#999999] text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Categories</h4>
              <ul className="space-y-2">
                {categoriesLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#999999] text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Programs */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Programs</h4>
              <ul className="space-y-2">
                {programsLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#999999] text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Company */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#999999] text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Connect */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Connect</h4>
              <div className="mb-6">
                <p className="text-[#999999] text-xs mb-3">Download App</p>
                <div className="w-24 h-24 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="text-[#999999] hover:text-white transition-colors font-bold text-lg"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="#"
                  className="text-[#999999] hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="#"
                  className="text-[#999999] hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  𝕏
                </a>
                <a
                  href="#"
                  className="text-[#999999] hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        {/* Green accent stripe */}
        <div className="w-full h-1 bg-[#0A6B3C]"></div>

        {/* Bottom content */}
        <div className="bg-[#1A1D20] text-gray-300 py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* App prompt section */}
            <div className="mb-6 pb-6 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Download size={18} className="text-[#0A6B3C]" />
                  <span className="text-sm font-semibold text-white">
                    Get the iHerb App
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="px-3 py-2 bg-gray-700 rounded text-xs text-gray-400 flex items-center gap-2">
                    <span>App Store</span>
                  </div>
                  <div className="px-3 py-2 bg-gray-700 rounded text-xs text-gray-400 flex items-center gap-2">
                    <span>Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment methods section */}
            <div className="mb-6 pb-6 border-b border-gray-700">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                Payment Methods
              </p>
              <div className="flex flex-wrap gap-3">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map(
                  (method) => (
                    <div
                      key={method}
                      className="w-12 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-500">{method}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Legal and social section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                {legalLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
              <div className="text-gray-500">
                © 2026 iHerb, LLC. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
