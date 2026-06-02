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
        className="relative shrink-0 flex justify-center items-center"
        style={{ width: size * 2.2, height: size * 1.5 }}
      >
        <img
          src="/logo.png?v=2"
          alt="DamDiep Logo"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

    </div>
  );
};

export default DamDiepLogo;
