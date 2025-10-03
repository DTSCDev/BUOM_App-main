
import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/cbc3ecff-e760-48db-a51c-2ac0ce1605d1.png')" }}>
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
