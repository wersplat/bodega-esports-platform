import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Ensure compatibility with the current frontend setup
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ... Merge or add any unique utility functions from esport2.0/lib/utils.ts here, avoiding duplication ...
