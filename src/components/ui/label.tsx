import * as React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label {...props} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

export { Label };
