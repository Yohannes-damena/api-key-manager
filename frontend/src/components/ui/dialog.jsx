import * as React from 'react';

const DialogContext = React.createContext();

const Dialog = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (!isOpen) return null;

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={() => handleOpenChange(false)}
        />
        <div className="relative z-50 w-full max-w-lg mx-4">
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
};

const DialogContent = React.forwardRef(({ className = '', children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      ref={ref}
      className={`bg-card/95 backdrop-blur-md rounded-lg shadow-2xl border border-border/50 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

const DialogTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({ className = '', ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 ${className}`} {...props} />
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };

