# OBSIDIAN SOC - Product Requirements Document (Part 3)

## PRODUCT EXPERIENCE & ENTERPRISE UX

### CORE PRODUCT PHILOSOPHY
Every screen must answer:
* What happened?
* Why did it happen?
* What should I do next?
* How risky is this?
* What changed since yesterday?
Never build pages just to display data.

### DASHBOARD
Mission control center.
- **Welcome Section:** "Good Morning, Charan. No critical incidents detected during the last 6 hours."
- **KPI Cards:** Security Health, Active Incidents, Critical Threats, Investigations Today, Mean Resolution Time, AI Confidence, Files Processed, Reports Generated. Cards animate into view.
- **AI Briefing Card:** Centerpiece. Daily AI Brief with prioritized actions.
- **Live Activity Feed:** Timeline on the right side.

### INVESTIGATIONS
The heart of the application.
- **Investigation Cards:** Incident ID, Title, Severity, Risk Score, Status, Assigned Analyst, Time, AI Confidence, Quick Actions.
- **Investigation Workspace:** Left Panel (Timeline), Center (AI Findings, Evidence, Recommendations, Root Cause, MITRE, Attack Chain), Right Panel (Notes, Status, Assignee, Attachments, Related Incidents, Actions).

### AI WORKSPACE
NOT a chatbot. Think GitHub Copilot for SOC analysts.
- Structured sections: Summary, Analysis, Evidence, Confidence, Recommendations, References.
- Allow Copy, Export, Bookmark, Share.

### THREAT INTELLIGENCE
Beautiful, minimal.
- **Cards:** Most Active Threat, Fastest Growing Threat, Top Source Country, Highest Risk IP, Most Common Technique.
- **MITRE Heatmap:** Interactive.
- **Trend Chart:** 30 days attack growth.
- **Top Indicators:** IPs, Domains, Hashes, URLs, Processes.

### UPLOAD CENTER
Drag & Drop. Beautiful empty state. Animated processing pipeline (Uploading -> Parsing -> Normalizing -> AI Investigation -> Generating Report -> Completed).

### ANALYTICS & REPORTS
- **Analytics:** Executive style. Risk Score Trend, Severity Distribution, etc. Hover, export, fullscreen, filter.
- **Reports:** Grid view. Report Page (Executive Summary, Timeline, Charts, MITRE, Recommendations, Appendix). One-click download.

### KNOWLEDGE BASE & NOTIFICATIONS
- **Knowledge Base:** Notion-style searchable library.
- **Notifications:** Sliding panel from right. Grouped by Today, Yesterday, Earlier. Types: Upload, Incident, AI, Report, Security, System.

### UX PATTERNS & MICRO INTERACTIONS
- **Empty States:** Encouraging action, no generic "No Data".
- **Loading States:** Skeletons and shimmer, no spinners.
- **Command Palette:** CTRL+K (Raycast style).
- **Animations:** 120-250ms, ease in/out, no bounce. Fade, slide, scale, skeleton, card hover, count-up.
- **Premium Touches:** Keyboard shortcuts, Quick actions, Breadcrumbs, Undo snackbar, Resizable panels, Custom widgets, Draft reports.

### DESIGN QUALITY CHECKLIST
- Looks like enterprise software.
- Consistent spacing (8px), typography, color tokens.
- Clear primary action.
- Accessible (keyboard navigation, ARIA labels, focus rings).
