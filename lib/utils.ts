import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const version = 1.3

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
