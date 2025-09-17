import { BottomNavigation } from "@/components/bottom-navigation";
import { ChatBotButton } from "@/components/chat-bot-button";

export default function Categories() {
  return (
    <div className="min-h-screen pb-24 px-4 md:px-8 lg:px-16">
      <div className="container py-4">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Categories will be mapped here */}
        </div>
      </div>
      <BottomNavigation />
      <ChatBotButton />
    </div>
  );
}
