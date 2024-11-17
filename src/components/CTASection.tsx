import React from 'react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Specialists CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Turf Specialists</h3>
            <p className="text-xl text-gray-600 mb-6">
              Ready to expand your professional network and find new opportunities?
            </p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Create your professional profile
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Set your availability
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Start receiving job matches
              </li>
            </ul>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Join as a Specialist
            </button>
          </div>

          {/* Facilities CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Facility Managers</h3>
            <p className="text-xl text-gray-600 mb-6">
              Need qualified turf specialists for your facility maintenance?
            </p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Post your facility needs
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Browse verified specialists
              </li>
              <li className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">✓</span>
                Schedule maintenance easily
              </li>
            </ul>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Register Your Facility
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}