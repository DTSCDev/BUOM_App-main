
import { Icon } from "@/components/NetAssetValue/Icon";
import { Category } from "@/types/NetAssetValue";

interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold flex items-center">
        <Icon name={category.icon || "package"} className="mr-2 h-5 w-5" />
        {category.name}
      </h2>
    </div>
  );
}
