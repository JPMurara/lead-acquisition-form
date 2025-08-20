"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
export function ChatInput({ onSendMessage, disabled, placeholder, }) {
    const [message, setMessage] = React.useState("");
    const inputRef = React.useRef(null);
    // Focus the input when it becomes enabled
    React.useEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex items-center space-x-2 p-4 border-t", children: [_jsx(Input, { ref: inputRef, value: message, autoFocus: true, onChange: (e) => setMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: placeholder || "Type your message...", disabled: disabled, className: "flex-1" }), _jsx(Button, { type: "submit", size: "icon", disabled: !message.trim() || disabled, className: "shrink-0", children: _jsx(Send, { className: "h-4 w-4" }) })] }));
}
//# sourceMappingURL=chat-input.js.map