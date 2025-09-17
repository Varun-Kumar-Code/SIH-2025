import { Home, Heart, Grid3x3, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Grid3x3, label: "Categories", path: "/categories" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { icon: User, label: "Profile", path: "/user" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg backdrop-blur-sm bg-background/95 border-t md:rounded-t-2xl lg:rounded-t-3xl">
      <div className="flex items-center justify-around py-3 px-4 md:py-4 md:px-6">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            size="icon"
            asChild
            className={`flex flex-col items-center gap-1 p-2 md:p-3 h-auto transition-all ${
              location === path
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
            data-testid={`button-nav-${path.slice(1) || 'home'}`}
          >
            <Link href={path}>
              <div className="flex flex-col items-center">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden md:block text-xs lg:text-sm font-medium">{label}</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
