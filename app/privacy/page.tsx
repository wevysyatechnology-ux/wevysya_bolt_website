"use client";

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';

const sections = [
  {
    title: 'Introduction',
    content: `The terms "We" / "Us" / "Our" / "Organization" individually and collectively refer to We Vysya and the terms "You" / "Your" / "Yourself" refer to the users/members.\n\nThis Privacy Policy is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder and the amended provisions pertaining to electronic documents/records in various statutes as amended by the Information Technology Act, 2000. This Privacy Policy does not require any physical, electronic, or digital signature.\n\nThis Privacy Policy is a legally binding document between you and We Vysya. The terms of this Privacy Policy will be effective upon your acceptance of the same (directly or indirectly in electronic form, by clicking on the I accept tab or by use of the website or by other means) and will govern the relationship between you and We Vysya for your use of the Website.\n\nPlease read this Privacy Policy carefully. By using the Website, you indicate that you understand, agree, and consent to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use this Website.`,
  },
  {
    title: 'User Information',
    content: `To avail certain services on our Websites, users are required to provide certain information for the registration process namely: a) your name, b) email address, c) sex, d) age, e) Address and PIN code, f) credit card or debit card details, g) business records and history, h) business information, i) password, etc., and/or your occupation, interests, and the like which are necessary for the provision of our services. The Information supplied by the users enables us to improve our sites and provide you with the most user-friendly experience.\n\nAll required information is service dependent and we may use the above-said user information to maintain, protect, and improve its services (including advertising services) and for developing new services.\n\nSuch information will not be considered as sensitive if it is freely available and accessible in the public domain or is furnished under the Right to Information Act, 2005 or any other law for the time being in force.`,
  },
  {
    title: 'Cookies',
    content: `To improve the responsiveness of the sites for our users, we may use "cookies", or similar electronic tools to collect information to assign each visitor a unique, random number as a User Identification (User ID) to understand the user's individual interests using the Identified Computer. Unless you voluntarily identify yourself (through registration, for example), we will have no way of knowing who you are, even if we assign a cookie to your computer.\n\nOur web servers automatically collect limited information about your computer's connection to the Internet, including your IP address, when you visit our site. Your IP address does not identify you personally. We use this information to deliver our web pages to you upon request, to tailor our site to the interests of our users, to measure traffic within our site, and let advertisers know the geographic locations from where our visitors come.`,
  },
  {
    title: 'Links to Other Sites',
    content: `Our policy discloses the privacy practices for our own website only. Our site provides links to other websites also that are beyond our control. We shall in no way be responsible for your use of such sites.`,
  },
  {
    title: 'Information Sharing',
    content: `We share the sensitive personal information with any third party without obtaining the prior consent of the user/member in the following limited circumstances:\n\n(a) When it is requested or required by law or by any court or governmental agency or authority to disclose, for the purpose of verification of identity, or for the prevention, detection, investigation including cyber incidents, or for prosecution and punishment of offenses. These disclosures are made in good faith and belief that such disclosure is reasonably necessary for enforcing these Terms and for complying with the applicable laws and regulations.\n\n(b) We propose to share such information within its group companies and officers and employees of such group companies for the purpose of processing personal information on its behalf. We also ensure that these recipients of such information agree to process such information based on our instructions and in compliance with this Privacy Policy and any other appropriate confidentiality and security measures.\n\nWe share the business or personal information to any third party or other members without obtaining the prior consent of the user/member if our services provided require us to do so.`,
  },
  {
    title: 'Information Security',
    content: `We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data. These include internal reviews of our data collection, storage and processing practices, and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data.\n\nAll information gathered on our Website is securely stored within our controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited. However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet.`,
  },
  {
    title: 'AI Services and Data Usage',
    content: `We use third-party AI service providers, specifically OpenAI, to process user inputs and generate responses. Data shared with OpenAI is used solely for providing app functionality and improving user experience.\n\nWhen using AI features within the app, certain user inputs such as queries, interactions, or activity-related data may be securely transmitted to OpenAI for processing.\n\nThis data is used only to deliver relevant responses and improve user experience. We do not use this data for advertising or tracking, and we do not sell user data.\n\nWe ensure that OpenAI maintains appropriate data protection and security standards. By using AI features in the app, users provide their consent for this data processing.\n\nThis Privacy Policy applies to the WeVysya AI, Social Hub and Meeting Companion apps available on the Google Play Store and App Store.`,
  },
  {
    title: 'Grievance Redressal',
    content: `Any complaints, abuse, or concerns with regards to content and or comment or breach of these terms shall be immediately informed to the designated Grievance Officer as mentioned below via in writing or through email signed with the electronic signature to Mr. Anil Gupta N ("Grievance Officer").`,
    contact: {
      name: 'Mr. Anil Gupta (Grievance Officer)',
      company: 'We Vysya',
      address: 'WeVysya Global Headquarters, 59/3, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru 560004',
      email: 'reachus@wevysya.com',
      phone: '+91 80 415 70393',
      website: 'www.wevysya.com',
    },
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="default" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-4">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              This document is published and shall be construed in accordance with the provisions of the Information Technology (Reasonable security practices and procedures and sensitive personal data of information) rules, 2011 under Information Technology Act, 2000.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-xl border border-emerald-800/30 bg-gradient-to-br from-[#0d2b1e]/60 to-[#0a1f16]/60 p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wide mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}
                {section.contact && (
                  <div className="mt-4 border-t border-emerald-800/20 pt-4 space-y-1 text-sm text-gray-400">
                    <p className="text-white font-semibold">{section.contact.name}</p>
                    <p>{section.contact.company}</p>
                    <p>{section.contact.address}</p>
                    <a href={`mailto:${section.contact.email}`} className="block text-emerald-400 hover:text-emerald-300 transition-colors">
                      {section.contact.email}
                    </a>
                    <p>{section.contact.phone}</p>
                    <p>{section.contact.website}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 text-center text-xs text-gray-600"
          >
            We may change our Privacy Policy from time to time to incorporate necessary future changes. Our use of any information we gather will always be consistent with the policy under which the information was collected.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
