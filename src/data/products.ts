import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Sac à dos ergonomique Premium",
    price: 18500,
    description: "Sac à dos résistant avec rembourrage lombaire pour écoliers.",
    category: "Sacs à dos",
    image: "https://via.placeholder.com/300x300?text=Sac+a+dos",
    inStock: true,
  },
  {
    id: 2,
    name: "Gourde Isotherme 500ml",
    price: 6500,
    description: "Gourde en inox gardant les boissons fraîches pendant 12h.",
    category: "Accessoires",
    image: "https://via.placeholder.com/300x300?text=Gourde",
    inStock: true,
  },
  {
    id: 3,
    name: "Boîte à goûter / Lunch box",
    price: 4500,
    description: "Lunch box étanche avec compartiments pour le repas.",
    category: "Accessoires",
    image: "https://via.placeholder.com/300x300?text=Lunch+Box",
    inStock: true,
  }
];