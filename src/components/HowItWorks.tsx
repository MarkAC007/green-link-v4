import React from 'react';
import { ClipboardCheck, Calendar, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Set up your professional profile with credentials and expertise",
      icon: ClipboardCheck
    },
    {
      title: "Set Availability",
      description: "Mark your available dates and preferred locations",
      icon: Calendar
    },
    {
      title: "Get Matched",
      description: "Connect with facilities that match your expertise and schedule",
      icon: CheckCircle
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-green-50">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <step.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">{step.title}</h3>
              <p className="text-green-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}