import React from 'react';

interface DamDiepLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const DamDiepLogo: React.FC<DamDiepLogoProps> = ({
  size = 100,
  className = '',
  showText = true,
  textClassName = 'text-xl font-extrabold text-slate-900 dark:text-white leading-none'
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="DamDiep Logo"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      {showText && (
        <div>
          <h1 className={textClassName}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891B2] to-[#059669]">D</span>am<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891B2] to-[#059669]">D</span>iep
          </h1>
        </div>
      )}
    </div>
  );
};

export default DamDiepLogo;
