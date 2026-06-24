# Engineering Decision Log

## 1. Why did you choose this technology stack?

I went with Next.js and TypeScript because it lets me build the frontend and backend in one place. For a project like this, it keeps things simple and easy to maintain. TypeScript also helps catch mistakes early while developing.

I used Tailwind and shadcn/ui because they make it easy to build a clean UI quickly without being locked into a heavy component library. I also used Recharts since it was more than enough for the analytics dashboard and easy to integrate.

## 2. Why did you choose this database?

I chose PostgreSQL because the data structure is pretty straightforward and the dashboard relies on aggregation queries like counts, trends, and category breakdowns. PostgreSQL handles these really well and is something I'm comfortable working with.

## 3. Why did you structure your application this way?

I wanted to keep things simple and easy to understand. The APIs are separated from the UI, validation is shared between frontend and backend, and reusable code is kept in common utility files. This made development faster and reduced duplication.

## 4. What trade-offs did you make due to time constraints?

I focused on building the core functionality first. Because of time limitations, I skipped things like real-time updates, advanced authentication, email notifications, and a more sophisticated sentiment analysis system.

## 5. What would you improve if you had one more week?

I'd add real-time dashboard updates, better testing, export functionality, email notifications, and a more advanced feedback management workflow for admins.

## 6. What was the most difficult technical challenge you faced?

The biggest challenge was designing the analytics section in a way that would still perform well as the amount of feedback grows. Instead of processing everything in the application, I moved most of the aggregation work to the database.

## 7. Which AI tools did you use?

I used Claude and ChatGPT throughout the project for brainstorming, reviewing ideas, debugging, and discussing different implementation approaches.

## 8. Share one instance where AI helped you.

AI helped me think through rate limiting strategies and compare different approaches before implementing the final solution.

## 9. Share one instance where you disagreed with AI and why.

One suggestion was to use MongoDB, but I felt PostgreSQL was a better fit because the data structure is well-defined and the dashboard relies heavily on analytics queries.

## 10. What would break first if this application suddenly had 100,000 users?

The database would probably become the first bottleneck due to the number of concurrent requests. Adding caching, connection pooling, and read replicas would be the first steps to handle that growth.

## 11. What is one thing in this assignment that you would improve, change, or challenge?

I would ask for more clarity around whether the analytics dashboard is expected to be real-time or near real-time. That decision affects several architectural choices and would help define the best implementation approach from the start.
