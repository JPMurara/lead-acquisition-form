import * as React from "react";
interface MessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: Date;
    isTyping?: boolean;
}
export declare function Message({ role, content, timestamp, isTyping }: MessageProps): import("react/jsx-runtime").JSX.Element;
export declare function MessageList({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
