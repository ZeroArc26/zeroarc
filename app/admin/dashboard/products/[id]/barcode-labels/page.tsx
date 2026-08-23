import { notFound } from "next/navigation";

import { getProductById } from "@/lib/actions/products/getProductById";
import BarcodeLabelPrint from "@/components/admin/products/BarcodeLabelPrint";

export default async function BarcodeLabelsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <BarcodeLabelPrint product={product} />
    </div>
  );
}
