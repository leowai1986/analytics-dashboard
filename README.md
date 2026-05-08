# Analytics Dashboard

Built by **[Leandro Wainer](https://github.com/leowai1986/)** — Full-stack analytics dashboard.

A modern, responsive analytics dashboard built with **Next.js 15**, **Tailwind CSS v4**, and **TypeScript**.

## 🚀 Live Demo
[https://analytics-dashboard-ap2s1on4k-leowai1986s-projects.vercel.app/dashboard](https://analytics-dashboard-ap2s1on4k-leowai1986s-projects.vercel.app/dashboard)

## Features

- **Interactive Search** — Global search with keyboard shortcut (⌘K) across all pages
- **Notifications Panel** — Real-time notification center with read/unread states
- **Responsive Charts** — Area, Pie, and Bar charts with Recharts
- **Multi-page Dashboard** — Overview, Analytics, Customers, Reports, Settings
- **Mock Data** — Realistic data for a production-ready feel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Esc` | Close modal / panel |
| `↑ / ↓` | Navigate search results |
| `Enter` | Select result |

# Build
npm run build

## Project Structure
```
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── analytics/
│   │   ├── customers/
│   │   ├── reports/
│   │   └── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/
│   ├── layout/
│   ├── ui/
│   ├── search-modal.tsx
│   ├── notifications-panel.tsx
│   ├── metric-card.tsx
│   ├── activity-feed.tsx
│   └── region-table.tsx
├── hooks/
│   └── use-search.ts
├── data/mock.ts
├── lib/utils.ts
├── types/index.ts
├── .env
└── .npmrc
```

## Tech Stack

- Next.js 15
- Tailwind CSS 4
- TypeScript
- Recharts
- Lucide React

## Author

**Leandro Wainer** — Senior .NET Developer  
[linkedin.com/in/lwainer](https://linkedin.com/in/lwainer)
