import { describe, it, expect } from "vitest";
import { feedbackSchema } from "@/lib/validations";
import { analyzeSentiment } from "@/lib/sentiment";

describe("Feedback Validation", () => {
  it("accepts valid feedback", () => {
    const result = feedbackSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      category: "PRODUCT",
      message: "This is a great product that I love using every day",
      rating: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = feedbackSchema.safeParse({
      name: "J",
      category: "PRODUCT",
      message: "This is good feedback message",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message shorter than 10 characters", () => {
    const result = feedbackSchema.safeParse({
      name: "John",
      category: "PRODUCT",
      message: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = feedbackSchema.safeParse({
      name: "John",
      category: "INVALID_CATEGORY",
      message: "This is valid feedback text",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty email", () => {
    const result = feedbackSchema.safeParse({
      name: "John Doe",
      email: "",
      category: "SUPPORT",
      message: "This feedback has no email provided",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = feedbackSchema.safeParse({
      name: "John Doe",
      email: "not-an-email",
      category: "SUPPORT",
      message: "This feedback has invalid email",
    });
    expect(result.success).toBe(false);
  });
});

describe("Sentiment Analysis", () => {
  it("detects positive sentiment", () => {
    const { label } = analyzeSentiment("I absolutely love this product, it works great!");
    expect(label).toBe("positive");
  });

  it("detects negative sentiment", () => {
    const { label } = analyzeSentiment("This is terrible, broken and completely useless");
    expect(label).toBe("negative");
  });

  it("detects neutral sentiment", () => {
    const { label } = analyzeSentiment("The product exists and functions");
    expect(label).toBe("neutral");
  });

  it("returns score between -1 and 1", () => {
    const { score } = analyzeSentiment("amazing wonderful fantastic superb excellent");
    expect(score).toBeGreaterThanOrEqual(-1);
    expect(score).toBeLessThanOrEqual(1);
  });
});
