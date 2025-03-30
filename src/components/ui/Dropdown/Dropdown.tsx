import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((option: DropdownOption) => option.value === value)?.label ||
    label;

  return (
    <div className={`claymate-dropdown ${className}`} ref={dropdownRef}>
      <div
        className="claymate-dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="claymate-dropdown-label">{selectedOption}</span>
      </div>
      {isOpen && (
        <div className="claymate-dropdown-menu">
          {options.map((option: DropdownOption) => (
            <div
              key={option.value}
              className={`claymate-dropdown-item ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
