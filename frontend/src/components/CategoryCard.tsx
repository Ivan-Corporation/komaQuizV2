import React from "react";

interface CategoryCardProps {
  name: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
  isTrending?: boolean;
  isNew?: boolean;
}

export default function CategoryCard({
  name,
  image,
  selected,
  onSelect,
  isTrending,
  isNew,
}: CategoryCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={`relative rounded-xl overflow-hidden border cursor-pointer transition-transform duration-200 
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 
        shadow-md ${selected ? "ring-2 ring-indigo-500 border-transparent" : "border-gray-700"}`}
    >
      {/* Badge */}
      {(isTrending || isNew) && (
        <div
          className={`absolute top-2 right-2 z-20 px-2 py-0.5 text-[10px] font-bold text-white rounded-md uppercase shadow-sm ${
            isTrending ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isTrending ? "Trending" : "New"}
        </div>
      )}

      {/* Image container with better background */}
      <div className="w-full h-28 flex items-center justify-center bg-gray-900 border-b border-gray-800">
        <img
          src={image}
          alt={name}
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Name */}
      <div
        className={`text-center py-2 text-sm font-medium transition-colors duration-200 ${
          selected ? "text-indigo-400" : "text-white"
        }`}
      >
        {name}
      </div>
    </div>
  );
}
