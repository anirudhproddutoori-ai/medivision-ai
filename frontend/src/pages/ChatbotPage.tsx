import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Bot,
  Paperclip,
  Send,
  User,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hello! I am MediVision AI. How can I help you with your health questions or medical reports?",
  },
];

export function ChatbotPage() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const question = input.trim();

    if (!question || isTyping) {
      return;
    }

    const token = localStorage.getItem(
      "medivision_access_token"
    );

    if (!token) {
      toast.error("Please login again.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: question,
            session_id: "default",
          }),
        }
      );

      const data = await response.json();

      console.log("Chatbot response:", data);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to get a response from MediVision AI."
        );
      }

      const answer =
        data?.response ||
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect to MediVision AI.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      toast.error("Unable to get AI response.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] min-h-0 flex flex-col">

      {/* HEADER */}
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Medical Chatbot
        </h1>

        <p className="text-muted-foreground">
          Ask questions about your reports, symptoms, or medical terms.
        </p>
      </div>

      {/* CHAT CARD */}
      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">

        {/* MESSAGES AREA */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-4">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-4 max-w-[80%]",
                    msg.role === "user"
                      ? "ml-auto flex-row-reverse"
                      : ""
                  )}
                >

                  {/* AVATAR */}
                  <Avatar className="h-8 w-8 mt-1 border shrink-0">

                    {msg.role === "assistant" ? (
                      <>
                        <AvatarImage src="/bot-avatar.png" />

                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/user-avatar.png" />

                        <AvatarFallback className="bg-slate-100 text-slate-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}

                  </Avatar>

                  {/* MESSAGE */}
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm whitespace-pre-wrap break-words",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>

                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex gap-4 max-w-[80%]">

                  <Avatar className="h-8 w-8 mt-1 border shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex gap-1 items-center">

                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />

                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />

                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />

                  </div>

                </div>
              )}

              {/* AUTO SCROLL TARGET */}
              <div ref={bottomRef} />

            </div>
          </ScrollArea>
        </div>

        {/* INPUT AREA */}
        <div className="shrink-0 p-4 bg-background border-t">

          {/* QUICK QUESTIONS */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">

            {[
              "Explain my MRI result.",
              "What does pneumonia mean?",
              "Summarize my latest blood test.",
              "Is my heart rate normal?",
            ].map((prompt, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap rounded-full text-xs"
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isTyping}
              >
                {prompt}
              </Button>
            ))}

          </div>

          {/* CHAT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >

            {/* ATTACHMENT */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* INPUT */}
            <Input
              placeholder="Type your medical question..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              disabled={isTyping}
              className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background"
            />

            {/* MICROPHONE */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
            >
              <Mic className="h-5 w-5" />
            </Button>

            {/* SEND */}
            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>

          </form>

        </div>s

      </Card>
    </div>
  );
}