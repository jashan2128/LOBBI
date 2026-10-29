# LOBBI 🎮

### Find your people. Build your lobby. Play together.

LOBBI is a gaming community platform designed to help players discover gaming connections, explore lobbies, and find people to play with. It combines a modern web interface with player profiles, lobby-related functionality, and a 3D visual experience.

> **Project status:** In development.

## ✨ Features

- 🎮 **Lobby Discovery** — Explore gaming lobbies and find opportunities to play with others.
- 👥 **Player Discovery** — Browse player profiles and discover potential gaming partners.
- 🔐 **Authentication** — Supabase-powered authentication infrastructure.
- 🧑‍🤝‍🧑 **Player Profiles** — Profile-related functionality for gaming connections.
- 🛡️ **Safety & Reporting** — Reporting-related functionality to support safer interactions.
- 🌌 **3D Experience** — Interactive visual elements built with Three.js and React Three Fiber.
- 📱 **Modern Web UI** — A responsive interface built with Next.js and React.

*Features and availability may change as development progresses.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | User interface |
| TypeScript | Type-safe development |
| Supabase | Backend services and database integration |
| Three.js | 3D graphics |
| React Three Fiber | React-based 3D rendering |
| Tailwind CSS | Styling |
| Vercel | Deployment platform |

## 🚀 Getting Started

### Prerequisites

- Node.js compatible with your installed Next.js version
- pnpm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/jashan2128/LOBBI.git
cd LOBBI
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and configure the values using your own Supabase project settings.

Required variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `NEXT_PUBLIC_SITE_URL` | Local or deployed site URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret key, if required by the application |

Never commit `.env.local` or expose server-only secrets in browser code.

### 4. Configure the database

Review the SQL migration files in the `supabase/` directory and apply the required migrations to your development Supabase project in the correct order.

Review seed and cleanup scripts before executing them. Do not run test cleanup scripts against production data.

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Build for production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```text
LOBBI/
├── app/                  # Application routes and pages
├── components/           # Reusable UI components
│   ├── three/            # 3D and lobby visual components
│   └── ui/               # UI primitives
├── lib/                  # Application logic and utilities
│   └── supabase/         # Supabase integrations
├── public/               # Static assets and icons
├── supabase/             # SQL migrations and development scripts
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusions
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔐 Security

- Keep `.env.local` out of version control.
- Never expose Supabase secret or service-role keys to the browser.
- Use appropriate Supabase Row Level Security (RLS) policies.
- Validate and authorize sensitive operations on the server.
- Use separate development and production database environments.

## 🗺️ Roadmap

- [ ] Improve lobby discovery and player matching
- [ ] Refine player profiles and gaming preferences
- [ ] Strengthen safety and reporting workflows
- [ ] Improve accessibility and mobile responsiveness
- [ ] Add automated testing and continuous integration
- [ ] Publish a stable live demo

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome. Open an issue to discuss a proposed change before submitting a pull request.

## 📄 License

No license has been specified yet. All rights are reserved unless a license is added to this repository.

---

**Built by [Jashanpreet Singh](https://github.com/jashan2128)**

[View the repository](https://github.com/jashan2128/LOBBI)
