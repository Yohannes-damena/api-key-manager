import * as React from 'react';

const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-xl shadow-lg shadow-primary/20',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-xl shadow-lg shadow-destructive/20',
      outline: 'border border-input hover:bg-accent/80 hover:text-accent-foreground hover:border-primary/50',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
      ghost: 'hover:bg-accent/70 hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary',
    };

    const sizes = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

