import React from 'react';

const FeatureCard = ({ image, title, description}) => {
  return (
    <div className="inline-block">
    
      <div className="relative w-72  bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:-translate-y-2 border border-gray-700 group">
        {/* Card Header with Image */}
        <div className="h-60 relative overflow-hidden">
          <img 
            src={image} 
            alt="Concept Visualization" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default FeatureCard;