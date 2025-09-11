import React, { useState } from "react";

interface PricingToggleProps {
  onToggle?: (isYearly: boolean) => void;
  className?: string;
}

const PricingToggle: React.FC<PricingToggleProps> = ({
  onToggle,
  className = "",
}) => {
  const [isYearly, setIsYearly] = useState(false);

  const handleToggle = () => {
    const newValue = !isYearly;
    setIsYearly(newValue);
    onToggle?.(newValue);
  };

  return (
    <div
      className={`flex items-center justify-center space-x-3 md:space-x-4 ${className}`}
    >
      <span
        className={`text-sm md:text-base font-medium transition-colors ${
          !isYearly ? "text-blue-500" : "text-gray-500"
        }`}
      >
        Monthly
      </span>

      <button
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isYearly ? "bg-blue-500" : "bg-gray-500"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
            isYearly ? "translate-x-5 md:translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      <div className="flex  gap-3 items-center">
        <span
          className={`text-sm md:text-base font-medium transition-colors ${
            isYearly ? "text-blue-500" : "text-gray-500"
          }`}
        >
          Yearly /
        </span>
        <span className="text-xs text-blue-500">
          Save 64% when you pay annually
        </span>
      </div>
    </div>
  );
};

export default PricingToggle;
