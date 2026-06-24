import { FeedbackList } from "@/components/dashboard/feedback-list";

export const metadata = { title: "All Feedback | Acowale CRM" };

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p className="text-sm text-muted-foreground">Browse and filter all submitted feedback</p>
      </div>
      <FeedbackList />
    </div>
  );
}
