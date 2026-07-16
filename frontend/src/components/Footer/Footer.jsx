import { Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* Logo Section */}
        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            InterviewX AI
          </h1>

          <p className="mt-5 text-gray-400 leading-7">
            Practice AI-powered interviews, improve your resume,
            crack your dream placement, and get instant feedback.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold">
            Quick Links
          </h2>

          <ul className="mt-5 space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-bold">
            Resources
          </h2>

          <ul className="mt-5 space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Documentation</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold">
            Contact
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center gap-3 text-gray-400">
              <Mail size={18} />
              <span>support@interviewx.ai</span>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <Phone size={18} />
              <span>+91 9876543210</span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-5 text-2xl mt-6">

              <FaGithub className="cursor-pointer hover:text-blue-400 transition" />

              <FaLinkedin className="cursor-pointer hover:text-blue-400 transition" />

              <FaXTwitter className="cursor-pointer hover:text-blue-400 transition" />

            </div>

          </div>
        </div>

      </div>

      <hr className="border-slate-700 my-10" />

      <p className="text-center text-gray-500">
        © 2026 InterviewX AI. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;