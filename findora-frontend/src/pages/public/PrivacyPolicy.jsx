import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Shield, Lock, Eye, CheckCircle } from "lucide-react";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-blue-100 text-lg">Last updated: August 2026</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
            
            <p className="lead text-lg text-slate-600 mb-8">
              At Findora, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Transparency</h3>
                <p className="text-sm text-slate-500">We are clear about what data we collect and why we need it.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
                <p className="text-sm text-slate-500">We use industry-standard measures to protect your information.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Control</h3>
                <p className="text-sm text-slate-500">You have rights over your personal data and how it is used.</p>
              </div>
            </div>

            <h2>1. Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you register on the platform, create reports, or interact with other users.</p>
            
            <h3>Information collected during registration:</h3>
            <ul>
              <li>Full Name</li>
              <li>National Identity Card (NIC) number (where applicable for verification)</li>
              <li>Email address</li>
              <li>Phone number and contact information</li>
              <li>Location preferences (District, Nearest Town)</li>
              <li>Account credentials (passwords are securely hashed)</li>
            </ul>

            <h3>Information collected through usage:</h3>
            <ul>
              <li>Details submitted in lost, found, missing person, and missing pet reports (descriptions, locations, dates).</li>
              <li>Uploaded photographs and other evidentiary information.</li>
              <li>Comments, reactions, claims, and other user-generated content.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, including:</p>
            <ul>
              <li><strong>Providing Services:</strong> To create and manage your account, process reports, and facilitate the matching of lost and found items.</li>
              <li><strong>Location Matching:</strong> We use your location information (district/town) to provide relevant notifications and improve the accuracy of report matching in your area.</li>
              <li><strong>Communication:</strong> To send you email notifications regarding your reports, matches, claims, account security, and platform updates.</li>
              <li><strong>Authentication & Security:</strong> To verify your identity, secure your account, and prevent fraudulent activities.</li>
            </ul>

            <h2>3. Public vs. Internal Information</h2>
            <p>
              <strong>Publicly Displayed Information:</strong> When you create a report (lost, found, missing person/pet), the details of the report, including images, location, description, and your associated contact preferences (if you choose to make them visible), will be publicly accessible to other users on the platform to facilitate recovery.
            </p>
            <p>
              <strong>Internal Information:</strong> Your account credentials, hashed passwords, specific backend database identifiers, and any information you explicitly mark as private remain internal. Our administrative team has access to this data solely for moderation, support, and platform security purposes.
            </p>

            <h2>4. Information Disclosure</h2>
            <p>We do not sell your personal information. We may disclose your information in the following situations:</p>
            <ul>
              <li><strong>To Other Users:</strong> Information you include in public reports will be visible to others to help resolve the case.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information where required by law, subpoena, or if we reasonably believe that such action is necessary to comply with the law and the reasonable requests of law enforcement.</li>
              <li><strong>Safety & Protection:</strong> We may disclose your information to protect the security or integrity of our platform, or to protect the rights, property, or safety of Findora, our users, or others.</li>
            </ul>
            <p><strong>User Responsibility:</strong> Please be aware that any information you publicly submit in reports can be read, collected, and used by others. You are responsible for the personal information you choose to share publicly.</p>

            <h2>5. Data Storage, Retention, and Security</h2>
            <ul>
              <li><strong>Storage:</strong> Your information is stored in our secure backend databases.</li>
              <li><strong>Retention:</strong> We retain your personal information for as long as your account is active or as needed to provide you services, resolve disputes, and comply with legal obligations.</li>
              <li><strong>Security:</strong> We implement appropriate technical and organizational security measures designed to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</li>
            </ul>

            <h2>6. Cookies and Local Storage</h2>
            <p>
              We use local storage and session information (such as storing your authentication token) to keep you logged in and improve your user experience. We may use essential cookies to maintain platform security and functionality.
            </p>

            <h2>7. Your Rights and Choices</h2>
            <p>
              You have the right to access, update, or delete the personal information we hold about you. You can manage most of your information directly through your account dashboard. To request complete deletion of your account and associated data, please contact our support team.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <br/>
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

export default PrivacyPolicy;
