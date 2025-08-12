"use client";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { useState } from "react";
// Zod schema for form validation
const leadFormSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, "Please enter a valid phone number"),
});
export function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true);
            try {
                // Validate the entire form data with Zod
                const validatedData = leadFormSchema.parse(value);
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Form submitted:", validatedData);
                setIsSubmitted(true);
            }
            catch (error) {
                console.error("Error submitting form:", error);
            }
            finally {
                setIsSubmitting(false);
            }
        },
    });
    if (isSubmitted) {
        return (<Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Thank You!</CardTitle>
          <CardDescription>
            Your information has been submitted successfully. We'll be in touch
            soon!
          </CardDescription>
        </CardHeader>
      </Card>);
    }
    return (<Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lead Acquisition Form</CardTitle>
        <CardDescription>
          Please provide your contact information and we'll get back to you
          shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }} className="space-y-4">
          <form.Field name="name" validators={{
            onChange: ({ value }) => {
                var _a;
                const result = leadFormSchema.shape.name.safeParse(value);
                return result.success
                    ? undefined
                    : (_a = result.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message;
            },
        }}>
            {(field) => (<div className="space-y-2">
                <Label htmlFor={field.name}>Full Name</Label>
                <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Enter your full name" className={field.state.meta.errors ? "border-red-500" : ""}/>
                {field.state.meta.errors && (<p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>)}
              </div>)}
          </form.Field>

          <form.Field name="email" validators={{
            onChange: ({ value }) => {
                var _a;
                const result = leadFormSchema.shape.email.safeParse(value);
                return result.success
                    ? undefined
                    : (_a = result.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message;
            },
        }}>
            {(field) => (<div className="space-y-2">
                <Label htmlFor={field.name}>Email Address</Label>
                <Input id={field.name} name={field.name} type="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Enter your email address" className={field.state.meta.errors ? "border-red-500" : ""}/>
                {field.state.meta.errors && (<p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>)}
              </div>)}
          </form.Field>

          <form.Field name="phone" validators={{
            onChange: ({ value }) => {
                var _a;
                const result = leadFormSchema.shape.phone.safeParse(value);
                return result.success
                    ? undefined
                    : (_a = result.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message;
            },
        }}>
            {(field) => (<div className="space-y-2">
                <Label htmlFor={field.name}>Phone Number</Label>
                <Input id={field.name} name={field.name} type="tel" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Enter your phone number" className={field.state.meta.errors ? "border-red-500" : ""}/>
                {field.state.meta.errors && (<p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>)}
              </div>)}
          </form.Field>

          <Button type="submit" className="w-full" disabled={isSubmitting || !form.state.canSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>);
}
//# sourceMappingURL=lead-form.jsx.map