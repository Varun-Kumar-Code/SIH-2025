import { Button } from "@/components/ui/button";
import { Heart, Mic, ImagePlus, Send } from "lucide-react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/bottom-navigation";

export default function Product() {
  const [, setLocation] = useLocation();
  // You can fetch product details using params from the URL
  // For now, using static data as per the template
  return (
    <div className="min-h-screen pb-24 px-4 md:px-8 lg:px-16 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {/* Back button only visible on mobile */}
        {/* Top margin space for the page */}
        <div className="mt-8" />
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Product"
          className="w-full h-64 object-contain mb-6"
        />
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Horem</h2>
          <div className="flex items-center gap-1 text-yellow-500">
            <span className="text-base">★</span>
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <div className="text-xl font-bold text-primary mb-2">₹3456</div>
        <p className="text-muted-foreground mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
        </p>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" className="flex-1">Add to cart</Button>
          <Button variant="outline" className="flex items-center justify-center px-3">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
        <Button className="w-full mb-8" variant="default" onClick={() => setLocation("/payment")}>Buy Now</Button>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-6">Reviews</h3>
          
          {/* Reviews List */}
          <div className="space-y-6 mb-8">
            {/* Review 1 */}
            <div className="flex gap-4">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Reviewer" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Rahul Sharma</h4>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 my-1">
                  <span className="text-sm">★★★★★</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This product exceeded my expectations! The quality is outstanding and it arrived earlier than expected. Would definitely recommend.
                </p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="flex gap-4">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Reviewer" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Priya Verma</h4>
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 my-1">
                  <span className="text-sm">★★★★</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Beautiful design and great value for money. The finishing is perfect.
                </p>
              </div>
            </div>
          </div>

          {/* Add Review Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Add Your Review</h4>
            <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <img 
                  src="https://imgs.search.brave.com/6sZRHCMMvfkvvYz9DA2pEU6KiPUo_ujBE-3bx41bjxo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci8yMDAv/MTAxMC9IRC13YWxs/cGFwZXItc3VzaGFu/dC1pcy1sZWFuaW5n/LWJhY2stb24td2Fs/bC13ZWFyaW5nLWJs/YWNrLW92ZXJjb2F0/LXN1c2hhbnQtc2lu/Z2gtcmFqcHV0LXRo/dW1ibmFpbC5qcGc" 
                  alt="Your profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write your review..."
                    className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span className="text-sm">Add Media</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Voice</span>
                  </Button>
                </div>
                <Button size="sm" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Post</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
