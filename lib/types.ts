
export type ShopItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  moreInfo: string;
  createdAt: string;
}

export type CartItem = {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  addedAt: string;
  title: string;
  image: string | null;
  price: number;
  description: string | null;
  moreInfo: string | null;
}