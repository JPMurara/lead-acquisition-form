interface ConversationalFormWidgetProps {
    containerId?: string;
    apiEndpoint?: string;
    theme?: "light" | "dark";
    onFormSubmit?: (data: any) => void;
    onFormError?: (error: any) => void;
}
export declare function ConversationalFormWidget({ containerId, apiEndpoint, theme, onFormSubmit, onFormError, }: ConversationalFormWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
