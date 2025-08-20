interface ConversationalFormProps {
    apiEndpoint?: string;
    onFormSubmit?: (data: any) => void;
    onFormError?: (error: any) => void;
    logoUrl?: string;
    showPreview?: boolean;
}
export declare function ConversationalForm({ apiEndpoint, onFormSubmit, onFormError, logoUrl, showPreview, }: ConversationalFormProps): import("react/jsx-runtime").JSX.Element;
export {};
