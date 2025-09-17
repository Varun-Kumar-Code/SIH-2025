import { BottomNavigation } from "@/components/bottom-navigation";

export default function Favorites() {
  return (
    <div className="min-h-screen pb-24 px-4 md:px-8 lg:px-16">
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Favorite items will be mapped here */}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
