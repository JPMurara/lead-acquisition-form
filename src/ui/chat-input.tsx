import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled,
  placeholder,
}: ChatInputProps) {
  const [message, setMessage] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the input when it becomes enabled
  React.useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 p-4 border-t"
    >
      <Input
        ref={inputRef}
        value={message}
        autoFocus={true}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder || "Type your message..."}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className="shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
