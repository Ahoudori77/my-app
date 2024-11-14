import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
