import React from 'react';
import { QuizIcon } from './icons/QuizIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <QuizIcon className="w-7 h-7 text-violet-500" />
              <h3 className="text-xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Live Quiz Pro
              </h3>
            </div>
            <p className="text-sm text-zinc-500">The future of interactive, AI-powered quizzing.</p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="hover:text-violet-400 transition-colors text-sm">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-violet-400 transition-colors text-sm">How It Works</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>
          
          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-violet-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
             <h4 className="font-bold text-white mb-4">Follow Us</h4>
             <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">
                <TwitterIcon className="w-6 h-6" />
              </a>
               <a href="#" className="text-zinc-400 hover:text-violet-400 transition-colors">
                <LinkedInIcon className="w-6 h-6" />
              </a>
             </div>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 bg-zinc-950">
         <p className="text-xs text-center text-zinc-600">
          © 2025 Live Quiz Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;