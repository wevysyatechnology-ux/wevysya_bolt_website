"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [membershipDropdown, setMembershipDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/houses', label: 'Houses' },
    { href: '/membership', label: 'Membership' },
    { href: '/events', label: 'Events' },
    { href: '/blog', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-effect bg-background/80 shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" aria-label="WeVysya home">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => link.label === 'Membership' && setMembershipDropdown(true)}
                onMouseLeave={() => link.label === 'Membership' && setMembershipDropdown(false)}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-110 inline-flex items-center gap-1 relative group"
                >
                  {link.label}
                  {link.label === 'Membership' && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${membershipDropdown ? 'rotate-180' : ''}`} />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
                {link.label === 'Membership' && (
                  <AnimatePresence>
                    {membershipDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-40 rounded-xl glass-effect bg-background/95 border border-white/10 shadow-xl overflow-hidden"
                      >
                        <a
                          href="https://khub.wevysya.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-3 text-sm font-medium hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                        >
                          K HUB
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/membership">Join Now</Link>
              </Button>
            </motion.div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-effect bg-background/95 border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                  {link.label === 'Membership' && (
                    <a
                      href="https://khub.wevysya.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="block text-sm font-medium hover:text-primary transition-colors py-2 pl-4 text-muted-foreground"
                    >
                      ↳ K HUB
                    </a>
                  )}
                </motion.div>
              ))}
              <Button asChild className="w-full rounded-full">
                <Link href="/membership">Join Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
