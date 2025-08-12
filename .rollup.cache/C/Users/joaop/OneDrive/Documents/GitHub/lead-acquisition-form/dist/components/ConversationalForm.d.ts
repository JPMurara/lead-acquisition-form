interface ConversationalFormProps {
    apiEndpoint?: string;
    onFormSubmit?: (data: any) => void;
    onFormError?: (error: any) => void;
}
export declare function ConversationalForm({ apiEndpoint, onFormSubmit, onFormError, }?: ConversationalFormProps): import("react/jsx-runtime").JSX.Element;
export {};
