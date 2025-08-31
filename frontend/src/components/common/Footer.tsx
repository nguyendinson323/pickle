import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', href: ROUTES.HOME },
      { name: 'Tournaments', href: ROUTES.TOURNAMENTS },
      { name: 'Courts', href: ROUTES.COURTS },
      { name: 'Rankings', href: ROUTES.RANKINGS },
    ],
    legal: [
      { name: 'Terms and Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Privacy Notice', href: '/privacy-notice' },
      { name: 'Contact', href: '/contact' },
    ],
    federation: [
      { name: 'About the Federation', href: '/about' },
      { name: 'Official Rules', href: '/rules' },
      { name: 'Certifications', href: '/certifications' },
      { name: 'News', href: '/news' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏓</span>
              </div>
              <span className="font-bold text-white text-lg">
                FMP
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The official platform of the Mexican Pickleball Federation. 
              Connecting players, coaches, clubs and organizers throughout Mexico.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons can be added here */}
              <span className="text-gray-500 text-sm">
                © {currentYear} {APP_NAME}
              </span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Federation links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Federation</h3>
            <ul className="space-y-3">
              {footerLinks.federation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>
                Developed to promote the growth of pickleball in Mexico
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-gray-400">
              <span>🇲🇽 México</span>
              <span>📧 info@pickleballfed.mx</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;