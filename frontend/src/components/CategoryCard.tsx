interface CategoryCardProps {
  name: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
}

export default function CategoryCard({
  name,
  image,
  selected,
  onSelect,
}: CategoryCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-xl overflow-hidden border cursor-pointer transition hover:scale-105 shadow-md ${
        selected ? "ring-2 ring-indigo-500 border-transparent" : "border-gray-700"
      }`}
    >
      <div className="w-full h-28 flex items-center justify-center bg-black">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain bg-black"
        />
      </div>
      <div className="text-center py-2 text-sm font-medium">{name}</div>
    </div>
  );
}
