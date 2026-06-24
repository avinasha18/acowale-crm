import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackForm } from "@/components/feedback-form";

describe("FeedbackForm", () => {
  it("renders all required form fields", () => {
    render(<FeedbackForm />);

    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/feedback/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit feedback/i })).toBeInTheDocument();
  });

  it("shows character counter for message field", () => {
    render(<FeedbackForm />);
    expect(screen.getByText("0/1000")).toBeInTheDocument();
  });

  it("renders cancel and submit buttons", () => {
    render(<FeedbackForm />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit feedback/i })).toBeInTheDocument();
  });
});
