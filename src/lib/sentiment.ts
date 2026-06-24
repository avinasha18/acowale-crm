import Sentiment from "sentiment";

const analyzer = new Sentiment();

export function analyzeSentiment(text: string) {
  const result = analyzer.analyze(text);
  const score = result.comparative;

  let label: "positive" | "negative" | "neutral";
  if (score > 0.05) label = "positive";
  else if (score < -0.05) label = "negative";
  else label = "neutral";

  return {
    label,
    score: Math.max(-1, Math.min(1, score / 5)),
  };
}
