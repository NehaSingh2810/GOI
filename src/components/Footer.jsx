import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-4">GOI News Portal</h3>
            <p className="text-gray-300">
              Your trusted source for Government of India news and updates.
              Stay informed with the latest announcements and developments.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/news" className="text-gray-300 hover:text-orange-400 transition-colors">
                  News Feed
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Contact</h3>
            <p className="text-gray-300">
              Government of India<br />
              New Delhi, India<br />
              Email: info@gov.in
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Government of India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;