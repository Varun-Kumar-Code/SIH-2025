import { BottomNavigation } from "@/components/bottom-navigation";

export default function Cart() {
  return (
    <div className="min-h-screen pb-24 px-4 md:px-8 lg:px-16">
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="space-y-4">
          {/* Cart items will be mapped here */}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
