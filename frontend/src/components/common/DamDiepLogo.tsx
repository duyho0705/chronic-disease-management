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
        style={{ width: size * 2.5, height: 'auto' }}
      >
        <img
          src="/logo.png?v=3"
          alt="DamDiep Logo"
          className="w-full h-auto object-contain"
        />
      </div>

    </div>
  );
};

export default DamDiepLogo;
