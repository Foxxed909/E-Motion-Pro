import data from "@/data/fonts.json";

export type EmpFont = {
  index: number;
  slug: string;
  name: string;
  family: string;
  genre: string;
  blurb: string;
};

export const FONTS = data as EmpFont[];
export const fontBySlug = (slug: string) => FONTS.find((f) => f.slug === slug);
export const fontClass = (slug: string) => `font-${slug}`;
