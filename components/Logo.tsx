'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
}

export default function Logo({ size = 'md', subtitle, className = '' }: LogoProps) {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-10 h-10 -ml-2',
      text: 'text-lg',
      subtitle: 'text-xs',
    },
    md: {
      container: 'w-16 h-16 sm:w-20 sm:h-20 -ml-3',
      text: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm sm:text-base',
    },
    lg: {
      container: 'w-24 h-24 sm:w-28 sm:h-28 -ml-4',
      text: 'text-3xl sm:text-4xl',
      subtitle: 'text-base sm:text-lg',
    },
    xl: {
      container: 'w-28 h-28 sm:w-32 sm:h-32 -ml-4',
      text: 'text-4xl sm:text-5xl',
      subtitle: 'text-lg sm:text-xl',
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (animationContainer.current && !animationInstance.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/diamond.json',
      });
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, []);

  return (
    <div className={`${className}`}>
      <div className="flex items-center">
        <span className={`${config.text} font-bold text-slate-900 dark:text-white`}>AurumX</span>
        <div ref={animationContainer} className={config.container} />
      </div>
      {subtitle && (
        <p className={`${config.subtitle} text-gray-600`}>{subtitle}</p>
      )}
    </div>
  );
}
