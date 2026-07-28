# OBSIDIAN SOC - Product Requirements Document (Part 1)

### AI Security Operations Workspace
**Version:** 1.0

## PRODUCT VISION
**Mission:** Build an enterprise-grade AI-powered Security Operations Center (SOC) platform that transforms raw security events into actionable intelligence.

Obsidian SOC is an intelligent workspace where security analysts upload logs, investigate incidents, collaborate with AI, visualize threats, generate executive reports, and manage the complete lifecycle of cybersecurity investigations.

Experience should rival: CrowdStrike Falcon, Microsoft Sentinel, Splunk Enterprise Security, Palo Alto Cortex XDR, IBM QRadar, Elastic Security, Wiz, Vercel Dashboard, Linear, Notion.

## PRODUCT PHILOSOPHY
1. **Clarity over Complexity:** Remove unnecessary visual noise. Whitespace is a feature.
2. **Intelligence over Automation:** The AI explains its reasoning (Why, Impact, Confidence, Suggested action).
3. **Enterprise over Student:** Timeless enterprise experience (No neon, cyberpunk, matrix effects, generic AI gradients).
4. **Data First:** Answer "What happened?", "Why?", "What should I do next?"
5. **Trust Through Design:** Restrained animations, meaningful typography, excellent spacing.

## BRAND IDENTITY
**Product Name:** Obsidian SOC
**Tagline:** AI Security Operations Workspace
**Elevator Pitch:** AI-native cybersecurity operations platform that ingests security events, investigates incidents using Google Gemini 2.5 Flash, maps threats to MITRE ATT&CK, and helps security teams make faster, more informed decisions.

## DESIGN LANGUAGE
Interface feels like: Linear × Notion × Arc Browser × Vercel × Stripe Dashboard (Not ChatGPT).

### COLOR SYSTEM
- **Background:** `#0B0F14`
- **Surface:** `#12171F`
- **Card:** `#171D26`
- **Primary Accent:** `#C9A86A` (Gold - primary identity)
- **Secondary Accent:** `#7B61FF`
- **Success:** `#4CAF50`
- **Warning:** `#F6B93B`
- **Critical:** `#FF5C5C`
- **Information:** `#50A7FF`
- **Text:** `#F7F8FA`
- **Muted:** `#9CA3AF`
- **Borders:** `#2A313C`

### TYPOGRAPHY
- **Headings:** Space Grotesk
- **Body:** Inter
- **Numbers:** IBM Plex Mono

### ICON STYLE
Lucide Icons (Minimal, Outlined, Consistent stroke width)

### DESIGN SYSTEM
- 8px spacing system
- Rounded corners: 16px
- Cards: Large padding, Soft shadows, Thin borders
- NO glassmorphism or frosted blur.

### MOTION DESIGN
- Allowed: Fade, Slide, Scale, Skeleton loading, Card hover, Count-up numbers, Progress animations.
- Avoid flashy effects.

## APPLICATION STRUCTURE
Landing Page -> Authentication -> Workspace -> Investigations -> Threat Intelligence -> Analytics -> Reports -> Knowledge Base -> Settings

## TECH STACK
- **Frontend:** React 19, Vite, TypeScript, TailwindCSS, React Router, TanStack Query, Axios, Framer Motion, Lucide Icons, Recharts
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic, JWT, bcrypt, Python 3.12
- **Database:** Render PostgreSQL
- **AI:** Google Gemini 2.5 Flash
- **Storage:** Cloudinary
- **Deployment:** Render

## NON-FUNCTIONAL REQUIREMENTS
- Production-ready code quality, modular architecture, responsive UI, secure authentication, etc.
