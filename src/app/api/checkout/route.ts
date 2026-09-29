import { calculateDiscount } from "@/lib/pricing";
import { products } from "@/lib/products";

type CartItem = { productId: unknown; quantity: unknown };
type CheckoutRequest = { userId: unknown; items: unknown };

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let body: CheckoutRequest;

  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (typeof body.userId !== "string" || body.userId.trim() === "") {
    return badRequest("userId must be a non-empty string.");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest("items must be a non-empty array.");
  }

  let subtotal = 0;
  for (const item of body.items as CartItem[]) {
    if (!item || typeof item.productId !== "string") {
      return badRequest("Each item must include a productId.");
    }
    if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return badRequest("Each item quantity must be a positive integer.");
    }

    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      return badRequest(`Unknown productId: ${item.productId}.`);
    }
    subtotal += product.price * item.quantity;
  }

  return Response.json({ total: subtotal - calculateDiscount(subtotal) });
}
