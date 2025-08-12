import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ConversationalForm } from "./ConversationalForm";
export function ConversationalFormWidget({ containerId = "conversational-form-widget", apiEndpoint = "/api/chat", theme = "light", onFormSubmit, onFormError, }) {
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
        setIsLoaded(true);
    }, []);
    if (!isLoaded) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx("div", { className: `conversational-form-widget ${theme}`, children: _jsx(ConversationalForm, { apiEndpoint: apiEndpoint, onFormSubmit: onFormSubmit, onFormError: onFormError }) }));
}
//# sourceMappingURL=ConversationalFormWidget.js.map