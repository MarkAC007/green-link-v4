import React from 'react';
import { Award, Shield, Star } from 'lucide-react';

export function TrustIndicators() {
  return (
    <section className="py-12 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">GCSAA Certified</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">Verified Professionals</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">Top Rated Service</span>
          </div>
        </div>
      </div>
    </section>
  );
}