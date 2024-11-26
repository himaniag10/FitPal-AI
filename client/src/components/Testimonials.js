// src/components/Testimonials.js
import React from 'react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-gray-200">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { text: '"This app has transformed my fitness routine! I can easily track my progress."', author: 'Happy User' },
            { text: '"The goal-setting feature keeps me motivated and focused on my fitness goals."', author: 'Fitness Enthusiast' },
          ].map((testimonial, index) => (
            <blockquote key={index} className="p-6 bg-white rounded-lg shadow-md">
              <p className="italic text-lg">{testimonial.text}</p>
              <footer className="mt-4">- {testimonial.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
