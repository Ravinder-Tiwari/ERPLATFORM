import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="pt-16 pb-6 px-6 md:px-8 bg-transparent lg:px-16 text-gray-800 relative">
          {/* Title Section */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
            Filter by Popular Categories
          </h2>

          {/* Animated Grid SVG Background with Multiple Light Colors */}
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-30 z-[-1] pointer-events-none"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#grad1)" strokeWidth="1" />
              </pattern>

              {/* Gradient for Multiple Light Colors */}
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f18b8b', stopOpacity: 1 }} /> {/* Light Pink */}
                <stop offset="25%" style={{ stopColor: '#abe8ab', stopOpacity: 1 }} /> {/* Light Green */}
                <stop offset="50%" style={{ stopColor: '#85c6f2', stopOpacity: 1 }} /> {/* Light Blue */}
                <stop offset="75%" style={{ stopColor: '#f5da8b', stopOpacity: 1 }} /> {/* Light Yellow */}
                <stop offset="100%" style={{ stopColor: '#dda3e9', stopOpacity: 1 }} /> {/* Light Purple */}
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Filter Section (Carousel) */}
          <div className="relative">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {categories.map((cat, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 px-4 py-2">
                    <div>
                      <Button
                        onClick={() => searchJobHandler(cat)}
                        variant="outline"
                        className="w-full p-1 rounded-full bg-[#f2f6ff] text-[#121e48] border-2 border-[#D1D5DB] hover:bg-[#e5efff] hover:text-[#1e3276] transition-colors duration-300"
                      >
                        {cat}
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows */}
              <CarouselPrevious className="absolute -left-8 md:-left-12 top-1/2 transform -translate-y-1/2 text-[#1e3276]" />
              <CarouselNext className="absolute -right-8 md:-right-12 top-1/2 transform -translate-y-1/2 text-[#1e3276]" />
            </Carousel>
          </div>
        </div>
    );
}

export default CategoryCarousel;
