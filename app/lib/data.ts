export type Seller = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatar: string;
};

export type Product = {
  id: string;
  sellerSlug: string;
  name: string;
  price: number;
  image: string;
};

export const sellers: Seller[] = [
  {
    id: "1",
    slug: "ana-art",
    name: "Ana Art",
    bio: "Handmade ceramics and pottery",
    avatar: "/sellers/seller-4.jpg",
  },
  {
    id: "2",
    slug: "joao-wood",
    name: "João Wood",
    bio: "Woodcraft and furniture",
    avatar: "/sellers/seller-2.jpg",
  },
];

export const products: Product[] = [
  {
    id: "1",
    sellerSlug: "ana-art",
    name: "Ceramic Mug",
    price: 25,
    image: "/products/ceramics/mug.webp",
  },
  {
    id: "2",
    sellerSlug: "ana-art",
    name: "Clay Jar",
    price: 40,
    image: "/products/ceramics/jars.jpg",
  },
  {
    id: "3",
    sellerSlug: "joao-wood",
    name: "Basket",
    price: 120,
    image: "/products/home_decor/basket.jpg",
  },
];
