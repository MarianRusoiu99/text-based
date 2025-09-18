import React from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  readonly = false,
  onChange,
  size = 'md',
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue ?? value;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        const filled = rating <= displayValue;

        return (
          <button
            key={rating}
            type="button"
            className={cn(
              'transition-colors duration-150',
              sizeClasses[size],
              readonly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
              filled ? 'text-yellow-400' : 'text-gray-300'
            )}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            aria-label={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};