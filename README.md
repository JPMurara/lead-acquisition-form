# Conversational Form Widget

A React-based conversational form widget that can be easily embedded on any website via CDN or npm.

## Features

- 🤖 AI-powered conversational interface
- 📝 Multi-step form completion
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔧 Customizable API endpoints
- 📊 Form validation and error handling
- 🚀 Easy integration via CDN or npm
- 🎯 Configurable positioning and styling
- 📱 Mobile-responsive design

## Installation

### Via CDN (Recommended for quick integration)

```html
<!-- Include React and React-DOM -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- jsxRuntime compatibility layer -->
<script>
  window.jsxRuntime = {
    jsx: React.createElement,
    jsxs: React.createElement,
    Fragment: React.Fragment,
  };
</script>

<!-- Include the widget -->
<script src="https://cdn.jsdelivr.net/npm/conversational-form-widget@1.0.0/dist/index.umd.js"></script>
```

### Via npm

```bash
npm install conversational-form-widget
```

## Usage

### Basic HTML Integration

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Conversational Form Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- jsxRuntime compatibility layer -->
    <script>
      window.jsxRuntime = {
        jsx: React.createElement,
        jsxs: React.createElement,
        Fragment: React.Fragment,
      };
    </script>

    <script src="https://cdn.jsdelivr.net/npm/conversational-form-widget@1.0.0/dist/index.umd.js"></script>
  </head>
  <body>
    <div id="conversational-form"></div>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const { ConversationalFormWidget } = window.ConversationalFormWidget;

        const container = document.getElementById("conversational-form");
        const root = ReactDOM.createRoot(container);

        root.render(
          React.createElement(ConversationalFormWidget, {
            apiEndpoint: "https://your-api.com/api/chat",
            onFormSubmit: (data) => {
              console.log("Form submitted:", data);
              // Handle form submission
            },
            onFormError: (error) => {
              console.error("Form error:", error);
              // Handle errors
            },
          })
        );
      });
    </script>
  </body>
</html>
```

### React Component Usage

```jsx
import { ConversationalFormWidget } from "conversational-form-widget";

function App() {
  const handleFormSubmit = (data) => {
    console.log("Form submitted:", data);
    // Send data to your backend
  };

  const handleFormError = (error) => {
    console.error("Form error:", error);
    // Handle errors
  };

  return (
    <ConversationalFormWidget
      apiEndpoint="https://your-api.com/api/chat"
      onFormSubmit={handleFormSubmit}
      onFormError={handleFormError}
      logoUrl="https://your-logo.com/logo.png"
      showPreview={true}
      position="center"
      width="100%"
      height="600px"
    />
  );
}
```

### ES Module Usage

```html
<script type="module">
  import { ConversationalFormWidget } from "https://cdn.jsdelivr.net/npm/conversational-form-widget@1.0.0/dist/index.esm.js";

  // Use the widget
  const widget = new ConversationalFormWidget({
    apiEndpoint: "https://your-api.com/api/chat",
  });

  widget.mount("#conversational-form");
</script>
```

## API Reference

### Props

| Prop           | Type                                                                       | Default                        | Description                                     |
| -------------- | -------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------- |
| `apiEndpoint`  | `string`                                                                   | `"/api/chat"`                  | The API endpoint for the chat functionality     |
| `onFormSubmit` | `function`                                                                 | `undefined`                    | Callback function called when form is submitted |
| `onFormError`  | `function`                                                                 | `undefined`                    | Callback function called when an error occurs   |
| `theme`        | `"light" \| "dark"`                                                        | `"light"`                      | Theme for the widget                            |
| `containerId`  | `string`                                                                   | `"conversational-form-widget"` | ID for the container element                    |
| `logoUrl`      | `string`                                                                   | `undefined`                    | URL for the company logo                        |
| `showPreview`  | `boolean`                                                                  | `true`                         | Whether to show the form preview tab            |
| `position`     | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left" \| "center"` | `"center"`                     | Position of the widget                          |
| `width`        | `string`                                                                   | `"100%"`                       | Width of the widget                             |
| `height`       | `string`                                                                   | `"600px"`                      | Height of the widget                            |

### Form Data Structure

The form collects the following data:

```typescript
interface FormData {
  loanAmount: number; // Loan amount (1000-40000)
  loanType: string; // Type of loan
  name: string; // Full name
  email: string; // Email address
  phone: string; // Phone number
  chatHistory: string; // Complete conversation history
}
```

## API Requirements

Your backend API should accept POST requests to the specified endpoint with the following structure:

### Chat Endpoint (`/api/chat`)

**Request:**

```json
{
  "messages": [
    {
      "id": "string",
      "role": "user" | "assistant" | "system",
      "content": "string",
      "timestamp": "Date"
    }
  ],
  "formData": {
    // Current form data
  }
}
```

**Response:**

```json
{
  "response": "string", // AI response message
  "error": "string" // Optional error message
}
```

### Submit Endpoint (`/api/submit`)

**Request:**

```json
{
  "loanAmount": 15000,
  "loanType": "car loan",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "chatHistory": "USER: Hi\nASSISTANT: Hello..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Thank you John! Your loan application has been submitted successfully."
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the widget:

   ```bash
   npm run build
   ```

4. Test locally:
   ```bash
   npm run serve
   ```

### Project Structure

```
src/
├── components/
│   ├── ConversationalForm.tsx      # Main form component
│   └── ConversationalFormWidget.tsx # Widget wrapper
├── ui/                              # UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── chat-input.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── message.tsx
│   └── tabs.tsx
├── lib/                             # Utility functions
│   ├── data-extraction.ts
│   └── utils.ts
└── index.ts                         # Main entry point
```

## Publishing to npm

1. Update the version in `package.json`
2. Build the project: `npm run build`
3. Publish to npm: `npm publish --access public`

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.
