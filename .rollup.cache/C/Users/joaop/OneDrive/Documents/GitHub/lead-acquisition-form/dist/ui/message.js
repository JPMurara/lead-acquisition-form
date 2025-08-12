import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
export function Message({ role, content, timestamp, isTyping }) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";
    return (_jsx("div", { className: cn("flex w-full", isUser ? "justify-end" : "justify-start"), children: _jsxs("div", { className: cn("max-w-[80%] rounded-lg px-4 py-2 text-sm", isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"), children: [isTyping ? (_jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" }), _jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" }), _jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current" })] })) : (_jsx("p", { className: "whitespace-pre-wrap", children: content.replace("[SUBMIT_BUTTON]", "").trim() })), timestamp && (_jsx("p", { className: "mt-1 text-xs opacity-70", children: timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }) }))] }) }));
}
export function MessageList({ children }) {
    return (_jsx("div", { className: "flex flex-col space-y-4 overflow-y-auto p-4", children: children }));
}
//# sourceMappingURL=message.js.map