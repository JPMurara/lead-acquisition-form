import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ConversationalForm } from "./ConversationalForm";
export function ConversationalFormWidget({ containerId = "conversational-form-widget", apiEndpoint = "/api/chat", theme = "light", onFormSubmit, onFormError, logoUrl, showPreview = true, position = "center", width = "100%", height = "600px", }) {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        // Inject Tailwind CSS if not already present
        if (!document.querySelector("#tailwind-css")) {
            const link = document.createElement("link");
            link.id = "tailwind-css";
            link.rel = "stylesheet";
            link.href =
                "https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css";
            document.head.appendChild(link);
        }
        // Inject Lucide React icons CSS if not already present
        if (!document.querySelector("#lucide-css")) {
            const link = document.createElement("link");
            link.id = "lucide-css";
            link.rel = "stylesheet";
            link.href =
                "https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.css";
            document.head.appendChild(link);
        }
        setIsLoaded(true);
    }, []);
    const getPositionStyles = () => {
        switch (position) {
            case "bottom-right":
                return "fixed bottom-4 right-4 z-50";
            case "bottom-left":
                return "fixed bottom-4 left-4 z-50";
            case "top-right":
                return "fixed top-4 right-4 z-50";
            case "top-left":
                return "fixed top-4 left-4 z-50";
            case "center":
            default:
                return "relative";
        }
    };
    if (!isLoaded) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx("div", { className: `conversational-form-widget ${theme} ${getPositionStyles()}`, style: { width, height }, children: _jsx(ConversationalForm, { apiEndpoint: apiEndpoint, onFormSubmit: onFormSubmit, onFormError: onFormError, logoUrl: logoUrl, showPreview: showPreview }) }));
}
//# sourceMappingURL=ConversationalFormWidget.js.map