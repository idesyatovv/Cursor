"use client";

import { FormEvent, useEffect, useState } from "react";

type Product = { id: string; name: string; price: number };
type CheckoutResult = { total: number } | { error: string };

export default function CheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((catalogue: Product[]) => setProducts(catalogue))
      .catch(() => setResult({ error: "Unable to load products." }));
  }, []);

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const items = products
      .map((product) => ({ productId: product.id, quantity: quantities[product.id] ?? 0 }))
      .filter((item) => item.quantity > 0);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "guest", items })
      });
      setResult((await response.json()) as CheckoutResult);
    } catch {
      setResult({ error: "Unable to submit checkout." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <form className="card stack" onSubmit={submitCheckout}>
        <div>
          <p className="muted">Guest checkout</p>
          <h1>Your cart</h1>
        </div>
        {products.length === 0 && !result ? <p className="muted">Loading products…</p> : null}
        {products.map((product) => (
          <label className="product" key={product.id}>
            <span>{product.name} — ${product.price.toFixed(2)}</span>
            <input
              aria-label={`${product.name} quantity`}
              min="0"
              onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: Number(event.target.value) }))}
              type="number"
              value={quantities[product.id] ?? 0}
            />
          </label>
        ))}
        <div><button disabled={isSubmitting} type="submit">{isSubmitting ? "Checking out…" : "Checkout"}</button></div>
        {result && "total" in result ? <p className="success">Order total: ${result.total.toFixed(2)}</p> : null}
        {result && "error" in result ? <p className="error">{result.error}</p> : null}
      </form>
    </main>
  );
}
