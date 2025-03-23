import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const words = ["Effortless Notes", "Smart Understanding", "Engaging Quizzes"];

const Home = () => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [letterIndex, setLetterIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true); // Flag to check if typing is in progress

    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                if (letterIndex < words[index].length) {
                    setDisplayText((prev) => prev + words[index][letterIndex]);
                    setLetterIndex((prev) => prev + 1);
                } else {
                    // Stop typing, and prepare for the next word after a delay
                    setIsTyping(false);
                }
            }, 100);

            return () => clearInterval(interval);
        } else {
            // Wait for 1 second, then reset and move to next word
            const timeout = setTimeout(() => {
                setDisplayText('');
                setLetterIndex(0);
                setIsTyping(true); // Start typing next word
                setIndex((prev) => (prev + 1) % words.length); // Cycle through words
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [index, letterIndex, isTyping]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center bg-gray-900 text-white px-4 py-16 relative overflow-hidden font-inter">
            
            {/* Background elements for glass effect */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Main content with glass effect */}
            <div className="relative z-10 max-w-4xl backdrop-filter backdrop-blur-sm bg-gray-900 bg-opacity-60 p-10 rounded-2xl border border-gray-800 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold leading-snug mb-6">
                        Recreate Your LMS with AI
                    </h1>
                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-blue-400"
                        key={index}>
                        {displayText}
                        <span className="animate-ping">|</span>
                    </motion.h1>
                    
                    <p className="text-xl text-gray-300 mb-8">
                        AI-powered tools to generate notes, query study materials, and create quizzes effortlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                        <Link to="/layout/student/chatbot">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
