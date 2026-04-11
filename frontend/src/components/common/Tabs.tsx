import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab: value,
            onTabChange: onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const TabsList: React.FC<TabsListProps & { activeTab?: string; onTabChange?: (value: string) => void }> = ({
  children,
  className,
}) => {
  return (
    <div className={`flex border-b border-slate-200 mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps & { activeTab?: string; onTabChange?: (value: string) => void }> = ({
  value,
  children,
  activeTab,
  onTabChange,
  className,
}) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={`px-4 py-2 font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-600 hover:text-slate-900'
      } ${className || ''}`}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps & { activeTab?: string }> = ({
  value,
  children,
  activeTab,
  className,
}) => {
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
