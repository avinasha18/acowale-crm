"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  { value: "PRODUCT", label: "Product Bug" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "UI_UX", label: "UI/UX" },
  { value: "SUPPORT", label: "Support" },
  { value: "BILLING", label: "Billing" },
  { value: "OTHER", label: "Other" },
];

export function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || "",
      category: formData.get("category") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        toast.error("Too many submissions. Please wait a minute and try again.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
        return;
      }

      setSubmitted(true);
      toast.success("Thank you! Your feedback has been submitted.");
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Thank you!</h3>
        <p className="text-sm text-gray-500">
          Your feedback has been submitted and will be reviewed by our team.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="mt-2"
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Customer Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            required
            minLength={2}
            maxLength={100}
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
          <Select name="category" required>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">Your Feedback</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Share your thoughts, suggestions, or ideas..."
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
        />
        <p className="text-xs text-gray-400 text-right">{message.length}/1,000</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email (optional)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          className="h-10"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#0f1623] hover:bg-[#1a2436] text-white font-medium"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
