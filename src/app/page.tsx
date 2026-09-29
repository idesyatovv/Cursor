import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="card stack">
        <p className="muted">Baseline store</p>
        <h1>Simple checkout</h1>
        <p>Choose products and receive a server-calculated total.</p>
        <div><Link className="button" href="/checkout">Go to checkout</Link></div>
      </section>
    </main>
  );
}
