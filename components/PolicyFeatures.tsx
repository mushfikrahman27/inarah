"use client";

export default function PolicyFeatures() {
  return (
    <section className="policy-features-section" aria-label="Policies and features">
      <div className="policy-features-grid">
        <div
          className="policy-feature-card"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="policy-icon"></div>
          <h3 className="policy-title"></h3>
          <p className="policy-description"></p>
        </div>
        <div
          className="policy-feature-card"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="policy-icon"></div>
          <h3 className="policy-title"></h3>
          <p className="policy-description"></p>
        </div>
        <div
          className="policy-feature-card"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="policy-icon"></div>
          <h3 className="policy-title"></h3>
          <p className="policy-description"></p>
        </div>
        <div
          className="policy-feature-card"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="policy-icon"></div>
          <h3 className="policy-title"></h3>
        </div>
      </div>
    </section>
  );
}
