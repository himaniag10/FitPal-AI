// src/components/Features.js
import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { title: 'Activity Tracking', desc: 'Monitor your daily activities and workouts to stay on track.' },
            { title: 'Goal Setting', desc: 'Set and achieve your fitness goals with personalized plans.' },
            { title: 'Progress Monitoring', desc: 'Visualize your progress over time with detailed reports.' },
          ].map((feature, index) => (
            <div key={index} className="feature p-6 bg-gray-100 rounded-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
