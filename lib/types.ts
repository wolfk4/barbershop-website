
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
  userId: string;
  quantity: number;
  addedAt: string;
  title: string;
  image: string;
  price: number;
  description: string;
  moreInfo: string;
  createdAt: string;
}