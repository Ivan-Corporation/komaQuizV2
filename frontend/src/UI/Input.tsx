import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  isPassword?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, isPassword = false, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = isPassword && type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    // Build padding classes based on icon and password visibility
    const paddingLeft = icon ? "pl-10" : "pl-4";
    const paddingRight = isPasswordType ? "pr-10" : "pr-4";

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`w-full ${paddingLeft} ${paddingRight} py-2
            bg-[#1f1f1f] text-white placeholder-gray-400 border border-gray-600 rounded-xl
            transition-all duration-300 ease-in-out
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
            hover:shadow-[0_0_8px_rgba(99,102,241,0.2)] ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
