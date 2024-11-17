import React from 'react';
import { Award, Shield, BadgeCheck } from 'lucide-react';

export default function TrustSection() {
  return (
    <section className="py-20 bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-green-100">Backed by recognized organizations and certifications</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-green-300" />
            <h3 className="text-xl font-semibold mb-4">Industry Certified</h3>
            <p className="text-green-100">
              Recognized by the Professional Grounds Management Society
            </p>
          </div>
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-green-300" />
            <h3 className="text-xl font-semibold mb-4">Verified Professionals</h3>
            <p className="text-green-100">
              All specialists undergo thorough background checks
            </p>
          </div>
          <div className="text-center">
            <BadgeCheck className="h-16 w-16 mx-auto mb-6 text-green-300" />
            <h3 className="text-xl font-semibold mb-4">Quality Assured</h3>
            <p className="text-green-100">
              Maintaining highest industry standards
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-2xl font-semibold mb-8">Our Industry Partners</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-75">
            <div className="text-center text-xl font-bold">USGA</div>
            <div className="text-center text-xl font-bold">PGA</div>
            <div className="text-center text-xl font-bold">GCSAA</div>
            <div className="text-center text-xl font-bold">STMA</div>
          </div>
        </div>
      </div>
    </section>
  );
}