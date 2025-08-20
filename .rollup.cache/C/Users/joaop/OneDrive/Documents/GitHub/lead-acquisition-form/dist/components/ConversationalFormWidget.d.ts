interface ConversationalFormWidgetProps {
    containerId?: string;
    apiEndpoint?: string;
    theme?: "light" | "dark";
    onFormSubmit?: (data: any) => void;
    onFormError?: (error: any) => void;
    logoUrl?: string;
    showPreview?: boolean;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
    width?: string;
    height?: string;
}
export declare function ConversationalFormWidget({ containerId, apiEndpoint, theme, onFormSubmit, onFormError, logoUrl, showPreview, position, width, height, }: ConversationalFormWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
