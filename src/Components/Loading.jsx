import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated spinner with lime accent */}
        <div className="relative inline-block">
          <FiLoader className="w-12 h-12 text-lime-500 animate-spin" />
          <div className="absolute inset-0 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text with subtle animation */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Processing</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we prepare your content
          </p>
          
          {/* Animated progress dots */}
          <div className="flex justify-center space-x-1 mt-4">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i}
                className="w-2 h-2 bg-lime-400 rounded-full inline-block"
                style={{
                  animation: `pulse 1.5s infinite ${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx = "true">{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;