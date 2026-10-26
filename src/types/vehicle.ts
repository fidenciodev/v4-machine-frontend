export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year?: string;
  km?: number | string;
  fuel?: string;
  transmission?: string;
  category: string;
  price?: number;
  image: string;
  images?: string[];
  tag?: string;
  featured?: boolean;
}
