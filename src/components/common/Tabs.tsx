import React, { useState, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export type TabsVariant = 'line' | 'filled' | 'pills' | 'enclosed';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsAlign = 'start' | 'center' | 'end' | 'stretch';

interface TabsProps {
  items: TabItem[];
  variant?: TabsVariant;
  size?: TabsSize;
  align?: TabsAlign;
  className?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  vertical?: boolean;
  fullWidth?: boolean;
}

const Tabs = ({
  items,
  variant = 'line',
  size = 'md',
  align = 'start',
  className = '',
  defaultTab,
  onChange,
  vertical = false,
  fullWidth = false,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || (items.length > 0 ? items[0].id : '')
  );

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Base classes for all tabs
  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50';

  // Variant classes
  const variantClasses = {
    line: {
      tabs: 'border-b border-neutral-200',
      tab: 'border-b-2 border-transparent hover:text-primary-600 hover:border-primary-300',
      active: 'border-primary-500 text-primary-600',
      inactive: 'text-neutral-600 hover:text-primary-600',
    },
    filled: {
      tabs: 'bg-neutral-100 p-1 rounded-lg',
      tab: 'rounded hover:bg-white/50',
      active: 'bg-white text-primary-600 shadow-sm',
      inactive: 'text-neutral-600',
    },
    pills: {
      tabs: '',
      tab: 'rounded-full hover:bg-neutral-100',
      active: 'bg-primary-50 text-primary-700',
      inactive: 'text-neutral-600',
    },
    enclosed: {
      tabs: 'border-b border-neutral-200',
      tab: 'border-t border-l border-r border-transparent rounded-t-lg -mb-px',
      active: 'bg-white border-neutral-200 border-b-white text-primary-600',
      inactive: 'bg-neutral-50 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100',
    },
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-2.5',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-2.5 px-4',
  };

  // Alignment classes
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: '',
  };

  // Vertical orientation classes
  const orientationClasses = vertical
    ? 'flex-col border-r border-neutral-200'
    : 'flex-row';

  const activeTabContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className={`${className}`}>
      <div
        className={`flex ${orientationClasses} ${
          !vertical ? alignClasses[align] : ''
        } ${
          variantClasses[variant].tabs
        }`}
        role="tablist"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            disabled={item.disabled}
            className={`
              ${baseClasses}
              ${sizeClasses[size]}
              ${variantClasses[variant].tab}
              ${
                activeTab === item.id
                  ? variantClasses[variant].active
                  : variantClasses[variant].inactive
              }
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${fullWidth && !vertical ? 'flex-1 text-center' : ''}
              ${vertical ? 'text-left' : ''}
              flex items-center gap-2
            `}
            onClick={() => !item.disabled && handleTabClick(item.id)}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && <span className="ml-auto">{item.badge}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4" role="tabpanel" aria-labelledby={`tab-${activeTab}`} id={`panel-${activeTab}`}>
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs; 