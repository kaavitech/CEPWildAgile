import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/wild-agile-logo.jpeg";
import mahaForestLogo from '@/assets/mahaForestLogo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* About */}
          <div>
            <img src={mahaForestLogo} alt="Maharashtra Forest Department" className="h-16 w-16 object-contain" />
            <h3 className="font-bold text-lg text-primary">Maharashtra <br/>Forest Department</h3>
            <p className="text-sm text-muted-foreground">
              Goverment of Maharashtra
            </p>
          </div>

          <div >
            <img src={logo} alt="WildAgile Foundation" className="h-16 w-16 object-contain" />
            <h3 className="font-bold text-lg text-primary">WildAgile Foundation</h3>
            <p className="text-sm text-muted-foreground">
              Building Environment Conscious Generation through forest education programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Program
                </Link>
              </li>
              <li>
                <Link to="/eco-centres" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Eco Centres
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Register School
                </Link>
              </li>
            </ul>
          </div>

          {/* Program Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Program</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Forest Department Partnership</li>
              <li>School Collaboration</li>
              <li>Guest Lecturers</li>
              <li>Safety & Compliance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="mt-1 text-primary" />
                <span>info@wildagile.org</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="mt-1 text-primary" />
                <span>+91 XXXX XXXXXX</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="mt-1 text-primary" />
                <span>Forest Department, State Office</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>&copy; 2025 WildAgile Foundation. All rights reserved. | Partnership with Forest Department</p>
          <Link to="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
