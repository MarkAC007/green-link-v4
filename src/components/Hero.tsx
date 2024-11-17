import React from 'react';
import { Grass, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Connecting Turf Specialists with Premier Facilities
          </h1>
          <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
            Streamline your turf management needs with Green Link - the professional platform that connects expert turf specialists with golf courses and sports facilities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition shadow-lg inline-block"
            >
              I'm a Turf Specialist
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-green-50 transition shadow-lg inline-block"
            >
              I Manage a Facility
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  );
}