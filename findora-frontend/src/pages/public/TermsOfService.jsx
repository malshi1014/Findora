import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";

function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-blue-100 text-lg">Last updated: August 2026</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
            
            {/* Safety Notice Highlight */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 not-prose">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Important Safety Notice</h3>
                  <p className="text-amber-800 leading-relaxed">
                    <strong>Findora does not guarantee the accuracy, authenticity, ownership, recovery, or safe return of any reported item, person, or pet.</strong> Users are responsible for verifying information and taking appropriate safety precautions. Findora is not responsible for physical meetings, item handovers, transactions, disputes, injuries, losses, damages, scams, or other incidents resulting from interactions between users.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Introduction and Acceptance of Terms</h2>
            <p>
              Welcome to Findora. Findora is a community-based lost and found platform designed to help users report and discover lost items, found items, missing persons, and missing pets. By accessing, browsing, or registering an account on Findora (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
            <p>
              Findora facilitates information sharing but <strong>does not act as a police authority, investigator, mediator, guarantor, buyer, seller, courier, or intermediary for physical handovers</strong>.
            </p>

            <h2>2. Eligibility and User Accounts</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. 
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2>3. User Responsibility for Submitted Reports</h2>
            <p>
              Users are solely responsible for the content, accuracy, and legality of the reports (Lost, Found, Suspicious, Missing Persons, Missing Pets) they submit to the platform. 
            </p>
            <ul>
              <li>You must not submit false, misleading, fraudulent, abusive, or malicious reports.</li>
              <li>You must only upload images and content that you have the right to use and that do not infringe on the intellectual property or privacy rights of others.</li>
            </ul>

            <h2>4. No Guarantee of Recovery and Limitations of Responsibility</h2>
            <p>
              By using Findora, you explicitly acknowledge and agree to the following:
            </p>
            <ul>
              <li><strong>No Guarantee:</strong> Findora does not guarantee that lost items, pets, or missing persons will be found or recovered.</li>
              <li><strong>No Verification:</strong> Findora does not independently verify or guarantee that every report, image, claim, or user statement published on the platform is genuine or accurate. Users must not blindly trust information found on the platform.</li>
              <li><strong>No Intermediary Role:</strong> Findora has no responsibility for the physical handover of items, physical meetings, transactions, or exchanges between users.</li>
              <li><strong>Liability:</strong> Findora is not responsible for theft, fraud, scams, injury, harassment, loss, damage, disputes, or other incidents arising from interactions between users.</li>
            </ul>

            <h2>5. Personal Safety and Meeting Precautions</h2>
            <p>
              When interacting with other users of the platform to recover or return an item, you are solely responsible for your own safety. We strongly advise you to:
            </p>
            <ul>
              <li>Independently verify ownership, identity, and evidence before taking action or handing over an item.</li>
              <li>Avoid sharing unnecessary personal information, financial details, or exact home addresses.</li>
              <li>Meet strangers only in safe, well-lit public locations during daylight hours.</li>
              <li>Consider involving trusted friends, family members, or appropriate local authorities when arranging a meeting.</li>
              <li><strong>For missing persons:</strong> Contact the appropriate law enforcement authorities when necessary and do not attempt dangerous interventions yourself.</li>
            </ul>

            <h2>6. Prohibited Content and Misuse</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Harass, threaten, or defraud other users.</li>
              <li>Post content that is illegal, offensive, discriminatory, or violates the rights of any third party.</li>
              <li>Attempt to gain unauthorized access to the platform's systems or user accounts.</li>
              <li>Use the platform for any commercial solicitation or spam without explicit authorization.</li>
            </ul>

            <h2>7. Account Suspension and Moderation</h2>
            <p>
              Findora reserves the right, at its sole discretion, to monitor, review, edit, or remove any content from the platform at any time. We may suspend or terminate your account and access to the Service if we believe you have violated these Terms of Service or engaged in fraudulent or harmful behavior, without prior notice or liability.
            </p>

            <h2>8. Platform Availability and Technical Limitations</h2>
            <p>
              While we strive to provide a reliable service, Findora is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted, error-free, secure, or free from viruses. We may experience hardware, software, or other problems or need to perform maintenance resulting in interruptions, delays, or errors.
            </p>

            <h2>9. Changes to the Service and Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at: <br/>
              <a href="mailto:findooora@gmail.com">findooora@gmail.com</a>
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-200 text-center">
              <Link to="/register" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                <CheckCircle className="w-5 h-5" />
                Return to Registration
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsOfService;
