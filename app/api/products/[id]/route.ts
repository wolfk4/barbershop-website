import products from "@/data/products.json";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = products.find((product) => product.id === id);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
