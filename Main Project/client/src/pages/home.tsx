import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { CategoryTabs } from "@/components/category-tabs";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useTheme } from "@/components/theme-provider";
import { ChatBotButton } from "@/components/chat-bot-button";
import type { Product } from "@shared/schema";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey:
      activeCategory === "All"
        ? ["/api/products"]
        : [`/api/products?category=${activeCategory}`],
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-background min-h-screen relative pb-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-muted-foreground">
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-background min-h-screen relative pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between py-4 md:py-6 bg-background">
        {/* User Avatar */}
        <img
          src="https://imgs.search.brave.com/6sZRHCMMvfkvvYz9DA2pEU6KiPUo_ujBE-3bx41bjxo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci8yMDAv/MTAxMC9IRC13YWxs/cGFwZXItc3VzaGFu/dC1pcy1sZWFuaW5n/LWJhY2stb24td2Fs/bC13ZWFyaW5nLWJs/YWNrLW92ZXJjb2F0/LXN1c2hhbnQtc2lu/Z2gtcmFqcHV0LXRo/dW1ibmFpbC5qcGc"
          alt="User profile"
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover ring-2 ring-accent"
          data-testid="img-user-avatar"
        />

        {/* App Title - Hidden on mobile, shown on tablet+ */}
        <h1 className="hidden md:block text-xl lg:text-2xl font-bold text-foreground">
          Jhar Yatra
        </h1>

        {/* Map Icon Button */}
        <Button
          variant="ghost"
          className="w-12 h-8 md:w-14 md:h-10 lg:w-16 lg:h-10 rounded-full flex items-center justify-center"
          data-testid="button-map"
        >
          <MapPin className="w-6 h-6 text-primary" />
        </Button>
      </header>

      {/* Search Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex gap-2 md:gap-3 max-w-2xl md:mx-auto">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-input border border-border rounded-lg md:rounded-xl text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>

          {/* Filter Button */}
          <Button
            className="px-4 py-3 md:px-6 md:py-4 bg-primary text-primary-foreground rounded-lg md:rounded-xl hover:bg-primary/90"
            data-testid="button-filter"
          >
            <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Product Grid */}
      <div className="mb-6">
        {filteredProducts.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
            data-testid="grid-products"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Chat Bot Button */}
      <ChatBotButton />
    </div>
  );
}