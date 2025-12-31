import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

  
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#logoGradient)"
        stroke="#ffffff"
        strokeWidth="2"
      />

      
      <rect x="35" y="35" width="30" height="15" fill="#ffffff" rx="2" />

   
      <ellipse cx="50" cy="32" rx="8" ry="5" fill="#ffffff" />

  
      <circle cx="42" cy="60" r="3" fill="#ffffff" />
      <circle cx="50" cy="60" r="3" fill="#ffffff" />
      <circle cx="58" cy="60" r="3" fill="#ffffff" />

   
      <line x1="45" y1="63" x2="47" y2="70" stroke="#ffffff" strokeWidth="1" />
      <line x1="50" y1="63" x2="50" y2="70" stroke="#ffffff" strokeWidth="1" />
      <line x1="55" y1="63" x2="53" y2="70" stroke="#ffffff" strokeWidth="1" />

 
      <path
        d="M40 70 Q45 75 50 70 Q55 75 60 70"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export default Logo;