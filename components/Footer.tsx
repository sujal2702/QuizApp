import React from 'react';
import { QuizIcon } from './icons/QuizIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <QuizIcon className="w-7 h-7 text-yellow-400" />
              <h3 className="text-xl font-black text-gray-900">
                ArenaQuest
              </h3>
            </div>
            <p className="text-sm text-gray-500">The future of interactive, AI-powered quizzing.</p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Pricing</a></li>
            </ul>
          </div>
          
          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
             <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
             <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5 text-gray-900" />
              </a>
               <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5 text-gray-900" />
              </a>
             </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 bg-white">
         <p className="text-xs text-center text-gray-500">
          © 2025 ArenaQuest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;