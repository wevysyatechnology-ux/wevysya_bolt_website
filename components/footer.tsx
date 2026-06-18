"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Logo size="sm" className="mb-6" />
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              The Arya Vysya Entrepreneurs Grid - Uniting business owners globally
              for growth, collaboration, and success.
            </p>
            <div className="flex space-x-3">
              <motion.a
                href="https://instagram.com/wevysya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WeVysya on Instagram"
                className="w-10 h-10 rounded-full bg-teal-500/20 hover:bg-teal-500/30 flex items-center justify-center transition-all"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-5 w-5 text-teal-400" />
              </motion.a>
              <motion.a
                href="https://facebook.com/wevysya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WeVysya on Facebook"
                className="w-10 h-10 rounded-full bg-teal-500/20 hover:bg-teal-500/30 flex items-center justify-center transition-all"
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-5 w-5 text-teal-400" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6">For Members</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/visitor-registration" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Attend as Visitor
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all mr-0 group-hover:mr-2"></span>
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-teal-400" />
                <span>Global Office, Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-teal-400" />
                <a href="mailto:info@wevysya.org" className="text-gray-400 hover:text-teal-400 transition-colors">
                  info@wevysya.org
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-teal-400" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-teal-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-400">
            © {currentYear} WeVysya - Arya Vysya Entrepreneurs Grid. All rights
            reserved.
          </p>
          <p className="mt-3">
            <span className="font-bold gradient-text text-lg">
              "STOP THINKING I, START THINKING WE"
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
