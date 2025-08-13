import * as React from "react";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isTyping?: boolean;
}

export function Message({ role, content, timestamp, isTyping }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
        {timestamp && (
          <p className="mt-1 text-xs opacity-70">
            {timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export function MessageList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col space-y-4 p-4">{children}</div>;
}
