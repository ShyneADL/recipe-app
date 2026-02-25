import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center p-2 md:p-4 rounded-lg animate-pulse shrink-0">
      {/* Image skeleton */}
      <div className="rounded-full lg:w-[180px] md:w-[150px] w-[80px] aspect-square bg-gray-200" />

      {/* Category name skeleton */}
      <div className="w-16 md:w-20 h-4 bg-gray-200 rounded mt-2" />
    </div>
  );
};

{
  /* <Link
                    key={category.id}
                    href={`/discover?category=${encodeURIComponent(
                      category.category
                    )}`}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="rounded-full lg:w-[200px] w-[120px]">
                      <Image
                        src={category.thumbnail || "/placeholder.jpg"}
                        alt={category.category}
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-black font-bold text-[1rem] text-center">
                      {category.category}
                    </span>
                  </Link> */
}

export default CategorySkeleton;
