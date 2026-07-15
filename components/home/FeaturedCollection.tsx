import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import { FEATURED_PRODUCTS } from "@/constants/products";

export default function FeaturedCollection() {
  return (
    <section className="py-24 bg-[#09090B]">
      <Container>
        <SectionHeading
          badge="FEATURED COLLECTION"
          title="Our Best Sellers"
          description="Discover premium oversized anime streetwear crafted for dreamers, creators and legends."
          center
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              variants={product.variants}
              tag={product.tag ?? ""}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}