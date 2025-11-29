import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  title: string;
  features: Feature[];
}

export default function Features({ title, features }: FeaturesProps) {
  return (
    <section className="py-20 bg-linear-to-b from-white via-quaternary/10 to-white relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="section-title text-5xl md:text-6xl font-bold text-center mb-4 text-primary animate-fade-in-up">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-primary mx-auto mb-16 rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-3xl shadow-lg hover-lift hover-glow border border-quaternary/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 animate-float">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-secondary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 w-12 h-1 bg-gradient-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
