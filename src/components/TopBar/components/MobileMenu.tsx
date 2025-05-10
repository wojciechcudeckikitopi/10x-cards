import { useState } from "react";
import { Navigation } from "./Navigation";

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 w-full absolute top-16 left-0 bg-white">
          <div className="container mx-auto px-4 py-2">
            <Navigation className="flex flex-col space-y-1" />
          </div>
        </div>
      )}
    </>
  );
};
