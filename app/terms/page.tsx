"use client";

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';

const sections = [
  {
    title: 'Preamble',
    content: `WeVysya strives to enhance your business by building your network. WeVysya helps you to achieve your long-term goals by connecting you with quality business professionals. The objective is to facilitate you with a networking environment that is constructive to both personal and professional growth. WeVysya supports business individuals through various programs to enhance the capabilities, organize training, workshops, coffee connections, online marketplace, business directories, and so on.`,
  },
  {
    title: 'Corporate Social Responsibility',
    content: `We maintain the utmost standards in regards to our relationships with the communities in which we function with our professional partners and with the people who work as part of our team. In all our dealings we:`,
    bullets: [
      'Work as a team',
      'Commit to excellence and insist on integrity',
      'Communicate openly, honestly, and directly',
      'Listen with an open mind; learn from everybody',
      'Take responsibility and lead by example',
      'Respect, trust and encourage others',
      'Establish purpose before action',
      'Gender Neutrality and women empowerment',
      'Exposure to NextG (Training young entrepreneurs)',
    ],
  },
  {
    title: 'Attendance Guidelines',
    content: `Attendance for every meeting is essential. Members are encouraged to secure substitutes when they are unable to be physically present. Having a substitute attendee does not count as an absence. Furthermore, at least 75% attendance is mandatory in any given 1-year period for renewal. If not, this will be cause for dismissal.`,
    bullets: [
      '1st Absence – No action',
      '2nd Absence – No action',
      '3rd Absence – Probation and observation period',
      '4th Absence – The membership committee chairman will open the category and allow a new member',
      '5th Absence – Membership Committee Chairman may remove the member',
    ],
  },
  {
    title: 'Business Meeting Timings',
    content: `As the WeVysya team believes – Regularity is one of the main principles for Victory! All the business meetings will start on time and will follow the planned agenda firmly.`,
    bullets: [
      'Meet & Greet with Coffee/Tea: 7:30 am – 8:00 am',
      'Business Meeting: 8:00 am – 9:30 am',
      'Networking Breakfast: 9:30 am – 10:30 am',
    ],
    note: 'Latecomers are not allowed to do Business Presentations. To avoid distraction latecomers will sit only in the back lane of the room. The meeting will continue as planned; no updates given to the late arrival person.',
  },
  {
    title: 'Dress Code Policy',
    content: `All members are expected to dress formally for all the business meetings.`,
    bullets: [
      'Men: formal shirt, tie, trousers, and shoes (western formal)',
      'Ladies: salwar suit, sari, or conservative western formals',
    ],
  },
  {
    title: 'Meeting Etiquettes',
    content: `Members have to ensure that visitors are not kept waiting for long. Value their time as you do yours. Members must ensure that they showcase their talent and knowledge professionally. Each meeting is an opportunity to expand your Business; therefore ensure all visitors are introduced to all the members. Offer your business card as you introduce yourself or are introduced to other visitors.\n\nSilence your smartphone. This includes tucking it away out of sight. Lights and vibrations can be distracting to everyone around you.\n\nShow respect by being professional, attentive, and engaged. A positive attitude starts with positive body language. Be courteous and listen when others are speaking, but also be sure to be an active participant.\n\nImportant Note: Members are strictly allowed to market, advertise or promote their registered category-related products and services only. Even though the member owns other businesses; he/she cannot promote the same without written approval from WeVysya Management Team.`,
  },
  {
    title: 'Visitors Policy',
    content: `It's important to note that the first impression is the best impression! Therefore, project professionalism. When visitors come into the business networking environment, they should be picked up personally from the reception and members must ensure that they walk with them to the Meeting Hall.\n\nDuring discussions; smile, maintain eye contact, listen, be positive, and do your best to help them with their queries.\n\nIn accordance with our non-solicitation policy, don't allow the visitor to video record any conversation/discussion. Visitors must not try to gather donations or request participation in other activities while on our meeting premises.`,
  },
  {
    title: 'Non-Compete or Non-Solicitation Clause',
    content: `As members, you will have access to the confidential information of WeVysya. The protection of confidential business information and trade secrets is vital to the interests and success of WeVysya. Members will be committed during the term of their tenure and for a period of one (1) year after their participation in WeVysya ceases, will not, directly or indirectly:`,
    bullets: [
      'Engage in activity that would compete with WeVysya',
      'Participate or assist in any manner with any House, region, individual or group that breaks from WeVysya',
      'Solicit any employee, consultant, member, or vendor of WeVysya to engage in competition with WeVysya',
    ],
    note: 'Failure to comply with this policy may result in disciplinary action. WeVysya may pursue monetary damages or other remedies according to the laws of India in the Courts of Bangalore, which will include termination of membership within 24 hrs.',
  },
  {
    title: 'Risk of Loss',
    content: `WeVysya is only a business networking platform, and it expects all its members to conduct business by adhering to ethical universal business principles:\n\n1. Promise-Keeping & Trustworthiness\n2. Concern for Others (Fairness)\n3. Law Abiding\n4. Commitment to Excellence (Quality) & Morale\n\nIn case of any mishaps such as loss or fraud during or after the execution of business deals by WeVysya members; the dispute must be resolved according to the laws of India in the Courts of Bangalore by the aggrieved member at his/her own cost. WEVYSYA WILL NOT BE INVOLVED IN ANY DISPUTE RESOLUTION ACTIVITY.`,
  },
  {
    title: 'Non-Disclosure Clause',
    content: `Members agree that any materials provided by WeVysya are of a proprietary nature and the exclusive property of WeVysya. Members shall protect all such property, adhere to the WeVysya Branding Standards, and shall relinquish any rights to such property upon termination of their association/membership.\n\nFailure to comply with this policy may result in disciplinary action and WeVysya may also pursue monetary damages or other remedies according to the laws of India in the Courts of Bangalore, which will include termination of membership within 24 hrs.`,
  },
  {
    title: 'Intellectual Property and Security Clause',
    content: `Intellectual property is referred to the softcopy of data, new inventions, formulas, confidential information, data, and business policies of WeVysya and/or Franchisee. Leaking this information or using them for self-interest is considered as unethical.\n\nAll intellectual property developed by members during their membership tenure, including discoveries or inventions made in the performance of their duties related in any way to WeVysya, will remain the property of WeVysya and/or Franchisee.\n\nMembers may be given access to confidential information, data, business property, keys to premises, or any other business-related property/information for the performance of their duties. This must be protected and used only in the interests of WeVysya and/or Franchisee.`,
  },
  {
    title: 'Social Media Content Publishing Policy',
    content: `"Social media" refers to a variety of online communities like blogs, social networks, chat rooms, and forums. This policy covers all of them. We advise members:`,
    bullets: [
      'Be conscious when mixing your business and personal lives',
      'Protect Confidential Information',
      'Be Transparent and post the right information',
      'Follow the Law, Follow the Code of Conduct',
      'Be Responsible, When in doubt, do not post',
    ],
    note: 'We will monitor all social media postings; we may have to take disciplinary legal action according to the laws of India in the Courts of Bangalore, which will include termination of membership within 24 hrs.',
  },
  {
    title: 'Anti-Retaliation Clause',
    content: `WeVysya strictly prohibits any form of retaliation against any member who in good faith makes a complaint, raises a concern, provides information, or otherwise assists in an investigation or proceeding regarding any conduct that he or she reasonably believes to be in violation of WeVysya's Code of Conduct or policies, or applicable laws, rules or regulations. Any Member who violates this policy is subject to disciplinary legal action according to the laws of India in the Courts of Bangalore, which will include termination of membership within 24 hrs.`,
  },
  {
    title: 'Disciplinary Action',
    content: `Members may be disciplined for poor attitude, including but not limited to the following:`,
    bullets: [
      'Fighting or threatening violence in meetings',
      'Attending meetings under influence of alcohol or illegal drugs',
      'Possession of dangerous or unauthorized materials',
      'Excessive absenteeism, tardiness, or abuse of privileges',
      'Failure to follow instructions, procedures, or standards',
      'Failure to follow established security regulations',
      'Theft or inappropriate removal or possession of property',
    ],
    note: 'Harassment of any kind relating to protected categories is strictly prohibited. WeVysya bans unwelcome sexual advances or physical contact and any sexually-oriented gestures, statements, or materials. Escalate your problem immediately in writing via email: reachus@wevysya.com',
  },
  {
    title: 'Personnel Data Changes',
    content: `It is the responsibility of each member to promptly notify the Membership Committee of any changes in personnel data such as mailing address, telephone numbers, email IDs, or individuals to be contacted in the event of an emergency. Member personnel data should be accurate and current at all times.`,
  },
  {
    title: 'Personal Property',
    content: `All members should be responsible for their own personal belongings. WeVysya assumes no risk for any loss or damage to personal property.`,
  },
  {
    title: 'Skill Enrichment Policy',
    content: `As learning is one of the fundamental principles of WeVysya; members are privileged to request workshops by sending an email to reachus@wevysya.com.\n\nTo keep the members abreast with the latest information, the WeVysya management team plans important workshops for all the members; this program is called "Nuggets". Further, for successful induction to the team, all members will undergo a "Graduation".`,
  },
  {
    title: 'Member Background Check Policy',
    content: `Background verification is done to protect WeVysya and its treasured members from various potential risks. At WeVysya we believe in validation not by faith, but by verification!\n\nMembers must cooperate in the implementation of this policy. Failure to consent may be subject to cancellation of membership with immediate effect. Further, members also authorize the validator(s) free from any kind of accusation/liability.`,
  },
];

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Dear WeVysyain, this Manual is designed to acquaint newly joined members to WeVysya and provide information about our culture, benefits, and policies. Members are responsible for reading, understanding, and complying with these policies. The decision of the WeVysya Management Team is final in all matters.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-xl border border-emerald-800/30 bg-gradient-to-br from-[#0d2b1e]/60 to-[#0a1f16]/60 p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wide mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">
                    {section.content}
                  </div>
                )}
                {section.bullets && (
                  <ul className="space-y-2 mb-4">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p className="text-xs text-gray-500 border-t border-emerald-800/20 pt-4 leading-relaxed">
                    {section.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 text-center text-xs text-gray-600"
          >
            Policies are subject to change at the discretion of the WeVysya Management Team.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
