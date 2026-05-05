import { mockOrders } from "./orders";
import { getDashboardTopProductsPayload } from "./dashboardTopProducts";

// Debug: Check for duplicate product IDs
export function debugProductDuplicates() {
  const payload = getDashboardTopProductsPayload({
    metric: "revenue",
    rangeDays: 30,
    platform: "all",
  });

  const allProducts = [
    ...payload.podium.map((p) => ({ section: "podium", ...p })),
    ...payload.ranking.map((p) => ({ section: "ranking", ...p })),
    ...payload.declining.map((p) => ({ section: "declining", ...p })),
  ];

  const idCounts = new Map<string, number>();
  const duplicates: typeof allProducts = [];

  for (const product of allProducts) {
    const count = (idCounts.get(product.id) || 0) + 1;
    idCounts.set(product.id, count);

    if (count > 1) {
      duplicates.push(product);
    }
  }

  console.log("🔍 Product ID Frequency:", Object.fromEntries(idCounts));
  console.log("⚠️ Duplicates found:", duplicates.length);
  
  if (duplicates.length > 0) {
    duplicates.forEach((d) => {
      console.log(`  - ID: ${d.id}, Section: ${d.section}, Name: ${d.name}`);
    });
  }

  // Check aggregation in orders
  const orderProductNames = new Map<string, number>();
  mockOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const count = (orderProductNames.get(item.productName) || 0) + 1;
      orderProductNames.set(item.productName, count);
    });
  });

  console.log("📦 Product names with duplicates in orders:");
  Array.from(orderProductNames.entries())
    .filter(([name, count]) => count > 1 && name)
    .forEach(([name, count]) => {
      console.log(`  - "${name}": ${count} times`);
    });
}

// Run debug on module load (development only)
if (import.meta.env.DEV && typeof window !== "undefined") {
  setTimeout(() => debugProductDuplicates(), 0);
}
