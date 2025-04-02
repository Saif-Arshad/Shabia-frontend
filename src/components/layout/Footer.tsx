
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-flex">
              <span className="text-xl font-bold tracking-tight text-primary">
                Shabia<span className="text-accent"></span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting Abu Dhabi communities with local services, events, and job opportunities.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Local Businesses
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Community News
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Job Board
                </Link>
              </li>
            </ul>
          </div>

       

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Abu Dhabi, United Arab Emirates
                </span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@abuconnect.ae"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@abuconnect.ae
                </a>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <a
                  href="tel:+97112345678"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +971 12 345 6789
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} AbuConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
