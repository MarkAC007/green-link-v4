import React from 'react';
import { Clock, DollarSign, Shield, Trophy } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      title: "Time Efficiency",
      description: "Quick matching with qualified professionals",
      icon: Clock
    },
    {
      title: "Cost Effective",
      description: "Competitive rates and transparent pricing",
      icon: DollarSign
    },
    {
      title: "Verified Experts",
      description: "All specialists are thoroughly vetted",
      icon: Shield
    },
    {
      title: "Quality Assured",
      description: "Maintain premium turf conditions",
      icon: Trophy
    }
  ];

  return (
    <section className="py-20 bg-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Green Link</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-3 bg-green-800 rounded-full mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-green-100">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}