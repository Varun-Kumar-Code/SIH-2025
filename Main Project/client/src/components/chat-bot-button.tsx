import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ChatBotButton() {
  return (
    <Button
      className="fixed bottom-20 right-4 rounded-full w-12 h-12 shadow-lg"
      size="icon"
      onClick={() => {
        // Add chat functionality here
        console.log("Chat bot clicked");
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}