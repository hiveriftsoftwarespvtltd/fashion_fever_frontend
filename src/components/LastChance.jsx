import React from 'react';
import { Link } from 'react-router-dom';
import Discover1 from '../assets/Discover1.png';
import Discover2 from '../assets/Discover2.png';
import Discover3 from '../assets/Discover3.png';
import Dicover4 from '../assets/Dicover4.png'; // Handled filename typo
import Discover5 from '../assets/Discover5.png';
import Discover6 from '../assets/Discover6.png';

const LastChance = () => {
  const images = [Discover1, Discover2, Discover3, Dicover4, Discover5, Discover6];

  return (
    <div className="w-full bg-[#fbd6e8] py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5">
          {images.map((img, index) => (
            <Link 
              key={index} 
              to="/shop"
              className="block cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 bg-white"
            >
              <img 
                src={img} 
                alt={`Discover Brand ${index + 1}`} 
                className="w-full h-auto block transition-transform duration-500 hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastChance;
