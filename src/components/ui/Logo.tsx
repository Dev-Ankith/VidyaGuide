import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-[8px] font-bold text-secondary-foreground">AI</span>
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold text-foreground">
          Vidya<span className="text-primary">Guide</span>
        </span>
      )}
    </Link>
  );
}
