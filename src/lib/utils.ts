import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomId() {
  return Math.random().toString(36).slice(2, 10).toLowerCase();
}

// https://stackoverflow.com/a/75605707/13388463
export const removeAttrFromObject = <O extends object, A extends keyof O>(
  object: O,
  attr: A,
): Omit<O, A> => {
  const newObject = { ...object };

  if (attr in newObject) {
    delete newObject[attr];
  }

  return newObject;
};

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
