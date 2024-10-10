import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container max-w-6xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="font-bold text-foreground mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Stacy is a cutting-edge AI-powered content creation platform,
              helping writers and businesses produce high-quality articles with
              ease.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Contact Us</h3>
            <address className="text-sm not-italic space-y-2">
              <p>123 AI Street</p>
              <p>Tech City, TC 12345</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@stacy.ai"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  info@stacy.ai
                </a>
              </p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <ThemeSwitcher />
          <p>
            &copy; {new Date().getFullYear()} Stacy AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
