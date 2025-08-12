import * as React from "react";
import { cn } from "@/lib/utils";
export function Message({ role, content, timestamp, isTyping }) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";
    return (<div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] rounded-lg px-4 py-2 text-sm", isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground")}>
        {isTyping ? (<div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
          </div>) : (<p className="whitespace-pre-wrap">
            {content.replace("[SUBMIT_BUTTON]", "").trim()}
          </p>)}
        {timestamp && (<p className="mt-1 text-xs opacity-70">
            {timestamp.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })}
          </p>)}
      </div>
    </div>);
}
export function MessageList({ children }) {
    return (<div className="flex flex-col space-y-4 overflow-y-auto p-4">
      {children}
    </div>);
}
//# sourceMappingURL=message.jsx.map