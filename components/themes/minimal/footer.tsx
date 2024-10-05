import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-foreground mb-2">About Us</h3>
            <p className="text-sm">
              Stacy is a cutting-edge AI-powered content creation platform,
              helping writers and businesses produce high-quality articles with
              ease.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Contact Us</h3>
            <address className="text-sm not-italic">
              <p>123 AI Street</p>
              <p>Tech City, TC 12345</p>
              <p>Email: info@stacy.ai</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t  text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Stacy AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
