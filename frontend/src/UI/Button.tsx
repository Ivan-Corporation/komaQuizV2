import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      className={`w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl 
      transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)]
      focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-95 ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
