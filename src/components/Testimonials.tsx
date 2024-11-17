import React from 'react';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Green Link has transformed how we manage our golf course maintenance. Finding qualified specialists has never been easier.",
      author: "John Smith",
      role: "Golf Course Manager",
      facility: "Pine Valley Golf Club"
    },
    {
      quote: "As a turf specialist, I've doubled my client base through Green Link. The platform is intuitive and professional.",
      author: "Sarah Johnson",
      role: "Turf Specialist",
      certification: "GCSAA Certified"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-green-50 p-8 rounded-lg relative">
              <Quote className="w-8 h-8 text-green-600 mb-4" />
              <p className="text-lg text-green-800 mb-4">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-green-900">{testimonial.author}</p>
                <p className="text-green-700">{testimonial.role}</p>
                <p className="text-green-600">{testimonial.facility || testimonial.certification}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}