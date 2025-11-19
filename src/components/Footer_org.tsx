import { Link } from 'react-router-dom';
import { TreePine, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TreePine className="h-6 w-6" />
              <span className="font-bold text-lg">CEP</span>
            </div>
            <p className="text-sm opacity-90">
              Empowering children through nature education and conservation awareness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/eco-centres" className="hover:text-accent transition-colors">
                  Eco Centres
                </Link>
              </li>
              <li>
                <Link to="/execution-plan" className="hover:text-accent transition-colors">
                  Execution Plan
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-accent transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lecturers" className="hover:text-accent transition-colors">
                  Guest Lecturers
                </Link>
              </li>
              <li>
                <Link to="/school/register" className="hover:text-accent transition-colors">
                  Register School
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-accent transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>info@childedprogram.org</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91-9876543210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Forest Department, Karnataka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>
            © 2025 Child Education Program. A collaboration between Forest Department & WildAgile Foundation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
