import ProductsHub from "@/components/ProductsHub";

export default function Home() {
  return (
    <>
      <ProductsHub home />
      <div className="wrap">
        <section style={{ paddingTop: 0 }}>
          <h2>How we build</h2>
          <p className="sub">Small team, short cycles, honest feedback.</p>
          <div className="grid">
            <div className="card"><h3>Problem first</h3><p>Every product starts with a real pain point, not a feature list.</p></div>
            <div className="card"><h3>Ship fast</h3><p>Small team, short cycles, constant feedback from users.</p></div>
            <div className="card"><h3>Stay focused</h3><p>We do fewer things and do them better.</p></div>
          </div>
        </section>
      </div>
    </>
  );
}
