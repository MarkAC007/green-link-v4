import React from 'react';
import { GrassIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <GrassIcon className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Green Link</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600">How it Works</a>
            <a href="#benefits" className="text-gray-600 hover:text-green-600">Benefits</a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600">Testimonials</a>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}