interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}
export declare function ChatInput({ onSendMessage, disabled, placeholder, }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
export {};
