export interface Rule {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  libs: string[];
  content?: string;
}

export type Section = {
  tag: string;
  rules: Rule[];
  slug: string;
};
