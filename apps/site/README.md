# 🎓 Aspire Academy - AI Mastery Platform

Production-ready AI education platform built with Next.js 14, Prisma, and NextAuth.

## 🚀 Quick Start

```bash
# Install dependencies
cd apps/site
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Visit **http://localhost:3000**

## 📦 Tech Stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS, shadcn/ui, Framer Motion
- **Auth:** NextAuth (Auth.js) with OAuth + Email/Password
- **Database:** Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Payments:** Stripe Checkout + Webhooks
- **Styling:** Black (#0A0A0A) & Gold (#D4AF37) brand colors

## 🎯 Features

### Core
- ✅ 14 comprehensive AI courses
- ✅ Video player with progress tracking
- ✅ Student dashboard with stats
- ✅ Authentication (email/password + OAuth)
- ✅ Stripe payment integration
- ✅ Certificate system (schema ready)
- ✅ Affiliate tracking structure

### Pages
- `/` - Landing page
- `/courses` - Course library
- `/courses/[slug]` - Course player
- `/dashboard` - Student progress
- `/pricing` - Pricing plans
- `/auth/signin` - Sign in
- `/signup` - Create account
- `/about` - About Aspire
- `/blog` - AI insights

## 🔧 Configuration

### Required Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### Optional (For Full Functionality)
```env
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Discord
DISCORD_BOT_TOKEN="..."
DISCORD_GUILD_ID="..."
```

## 📚 Available Courses

1. **AI Foundations** - Master LLMs and prompting
2. **AI for Business** - Revenue generation with AI
3. **AI for Coding** - Build 10x faster
4. **AI for Design** - Creative automation
5. **AI Security & OSINT** - Defensive AI
6. **Dark AI & Ethics** - Learn the dark side ethically
7. **AI Finance & Trading** - Algorithmic trading
8. **Advanced Prompting** - God-tier techniques
9. **AI Automation** - 24/7 AI systems
10. **Language Mastery** - Learn languages with AI
11. **Personal AI Shadow** - Your AI assistant
12. **Black Hat AI** - Ethical hacking (Mastermind only)
13. **AI Research** - Academic AI tools
14. **AI for Creators** - Content empire building

## 🎨 Brand Guidelines

### Colors
- **Black:** `#0A0A0A` (primary background)
- **Dark Surface:** `#0F0F0F` (cards, secondary backgrounds)
- **Gold:** `#D4AF37` (primary accent)
- **Deep Gold:** `#B8860B` (secondary accent)
- **Muted Text:** `#CFCFCF` (body text)

### Typography
- **Headings:** Manrope (bold, semibold)
- **Body:** Inter (regular, medium)

### Components
- **Buttons:** Rounded 2xl, gold gradient, hover scale
- **Cards:** Dark surface, gold border on hover, soft glow
- **Inputs:** Black background, gold focus ring

## 🧪 Testing

```bash
# Run all tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Docker
```bash
# Build and run
npm run docker:build
npm run docker:run
```

## 📖 Development

### Project Structure
```
apps/site/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages
│   ├── api/               # API routes
│   ├── courses/           # Course pages
│   └── dashboard/         # Student dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sections/         # Page sections
│   ├── courses/          # Course-specific components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities and configs
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe config
│   └── utils.ts          # Helper functions
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed data
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

Proprietary - Aspire Academy © 2025

## 🆘 Support

- Email: support@aspire.ai
- Discord: [Join our community](https://discord.gg/aspire)
- Docs: [docs.aspire.ai](https://docs.aspire.ai)

---

**Built with ❤️ by The Overseer**



