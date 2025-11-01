Debt Conqueror — Frontend Engineer Project
Overview

Debt Conqueror is a modular Debt Collection Dashboard designed to simulate a production-ready financial management tool.
It focuses on real-time case tracking, agent management, and performance analytics, built with scalable architecture and clean UI.

🚀 Objective
Design and develop a fully functional debt collection dashboard with:

Real-time data representation

Role-based access (Admin & Agent)

Case management workflows

Integrated API simulation

State persistence and scalability

************************************************************

Core Features
1. Authentication & Role-Based Access

Mock JWT login (simulated token).

Admin → full dashboard, agent management, analytics.

Agent → limited to assigned cases and task updates.

2. Dashboard Overview

Display KPIs: Total Cases, Resolved Cases, Pending Amount, Agent Efficiency.

Includes a chart (Bar / Line / Pie) for performance metrics using Recharts.

Simulated real-time data updates using polling or socket mock.

3. Case Management

Table view with sorting, filtering, and search.

On click → detailed modal view showing:

Borrower details

Payment history

Case timeline (Assigned → Follow-up → Resolved → Closed)

Status update and notes (mock PUT/POST).

4. Agent Management (Admin Only)

CRUD operations for agents.

View workload summary (assigned cases, recovery %).

Assign/unassign cases dynamically.

5. Activity Log / Audit Trail

Track all user actions (e.g., “Agent updated case status to Follow-up”).

Display logs in a collapsible timeline.

6. Performance Optimization

Lazy loading with React.lazy and Suspense.

Virtualized tables (react-window).

Centralized API service layer for abstraction.


********************************************************************************

Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/Prascyber/debt-conqueror-68.git
cd debt-conqueror-68

2️⃣ Install Dependencies
npm install

3️⃣ Run the Development Server
npm run dev

4️⃣ Open in Browser

Visit http://localhost:5173

🌐 Deployment

You can deploy easily to Vercel or Netlify:

npm run build


Then upload the /dist folder or connect your GitHub repo directly to Vercel.