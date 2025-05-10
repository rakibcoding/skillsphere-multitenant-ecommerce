"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}
const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
  return (
    <div className={(cn("p-4 border-b flex flex-col gap-4"), className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, SetFilters] = useProductFilters();
  const hasAnyFilters = Object.entries(filters).some(([, value]) => {
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });
  const onClear = () => {
    SetFilters({
      minPrice: "",
      maxPrice: "",
    });
  };
  const onChange = (key: keyof typeof filters, value: unknown) => {
    SetFilters({ ...filters, [key]: value });
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button className="underline" onClick={() => onClear()} type="button">
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
};
