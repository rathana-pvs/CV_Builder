# CV Builder SaaS — Complete Technical & Product Architecture

---

# 1. Project Overview

## Goal

Build an online CV/Resume builder SaaS platform that allows users to:

- Create resumes online
- Live preview resumes
- Export PDF
- Export DOCX
- Share public resume links
- Save multiple resumes
- Use professional templates

Long-term vision:

Transform into a full document infrastructure platform supporting:

- resumes
- cover letters
- invoices
- certificates
- contracts
- e-signatures
- OCR
- document APIs

---

# 2. Recommended Product Positioning

Instead of:

> “Another resume builder”

Position it as:

> Professional resume builder with editable DOCX export

or:

> Modern resume builder for developers and professionals

Potential regional advantage:

- Khmer language support
- SEA-focused templates
- localized design styles

---

# 3. MVP Scope

## Included Features

### Authentication
- Email/password login

### Resume CRUD
- Create resume
- Edit resume
- Delete resume
- Duplicate resume

### Resume Sections
- Personal info
- Summary
- Skills
- Education
- Experience
- Projects
- Languages
- Certifications

### Templates
- 3–5 templates

### Live Preview
- Realtime rendering

### Export
- PDF export
- DOCX export

### Public Resume Link
Example:

```txt
/cv/john-doe
4. Future Features
AI Features
ATS optimization
Grammar correction
Resume scoring
Keyword suggestions
Collaboration
Team review
Resume sharing
Marketplace
Premium templates
Document Expansion
Cover letters
Contracts
Certificates
Proposals
APIs
Resume generation API
PDF generation API
DOCX generation API
5. Recommended Tech Stack
Layer	Technology
Frontend	Next.js
Language	TypeScript
UI Library	Ant Design
Styling	Tailwind CSS
State Management	Zustand
Backend	Next.js API Routes
ORM	Prisma
Database	PostgreSQL
Cache	Redis
PDF Generation	Puppeteer
DOCX Generation	Docxtemplater
File Storage	Cloudflare R2
Authentication	Auth.js
Deployment	Docker
Reverse Proxy	Nginx
6. Frontend Architecture
Recommended Framework
Next.js

Why:

SSR support
API routes
App Router
SEO support
Fullstack architecture
Great developer experience
UI Library
Ant Design

Why:

Excellent form system
Enterprise-grade components
Tables
Modals
Dashboard UI

Best for:

admin systems
data-heavy forms
Styling
Tailwind CSS

Use Tailwind for:

resume templates
print styling
responsive layouts

Use Ant Design for:

application UI
forms
dashboard components
7. Backend Architecture
Recommended MVP Strategy

Use:

Next.js Fullstack Architecture

Avoid:

microservices
separate backend initially
Why?

Benefits:

simpler deployment
faster development
easier maintenance
fewer infrastructure costs
8. System Architecture Diagram
Frontend (Next.js)
        │
        ▼
API Layer
        │
 ┌──────┼────────────┐
 ▼      ▼            ▼
Postgres Redis      Storage
        │
        ▼
Resume Renderer
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
HTML   PDF       DOCX
9. Database Design
Database
PostgreSQL

Recommended because:

reliable
scalable
JSON support
relational support
ORM
Prisma

Benefits:

TypeScript support
migrations
autocomplete
clean syntax
10. Recommended Tables
users
users
-----
id
email
password_hash
name
created_at
resumes
resumes
--------
id
user_id
title
slug
template
data_json
is_public
created_at
updated_at
11. Resume JSON Structure

Store resume content as JSON.

Example:

{
  "personal": {
    "name": "John Doe",
    "email": "john@email.com",
    "phone": "+855123456"
  },
  "summary": "Frontend developer...",
  "skills": [
    "Next.js",
    "React",
    "SQL"
  ],
  "experience": [
    {
      "company": "ABC",
      "role": "Frontend Developer",
      "startDate": "2023",
      "endDate": "2025",
      "description": "Built dashboard systems"
    }
  ]
}
12. Resume Rendering Architecture
Recommended Strategy

Each resume template should be a React component.

Example:

<ModernTemplate data={resumeData} />
Why This Is Best

Benefits:

reusable
strongly typed
PDF-compatible
preview-compatible
easy customization
13. Template Structure
/templates
   /modern
   /minimal
   /corporate

Each template contains:

React component
print CSS
optional DOCX mapping
14. Live Preview Architecture
Form Input
    │
    ▼
Resume JSON
    │
    ▼
React Template Renderer
    │
    ▼
Live Preview
15. PDF Export Architecture
Recommended Tool
Puppeteer

Flow:

Resume JSON
      │
      ▼
React Template
      │
      ▼
HTML
      │
      ▼
Puppeteer
      │
      ▼
PDF
Why Puppeteer?

Best HTML → PDF rendering quality.

Advantages:

consistent rendering
modern CSS support
easy reuse of templates
16. DOCX Export Architecture
Recommended Tool
Docxtemplater
Flow
Resume JSON
      │
      ▼
DOCX Template
      │
      ▼
Docxtemplater
      │
      ▼
Generated DOCX
Why Template-Based DOCX Is Best

Advantages:

editable output
easier formatting
designer-friendly
more stable layouts
17. Authentication
Recommended
Auth.js

(formerly NextAuth)

MVP Authentication
email/password

Later:

Google OAuth
GitHub OAuth
LinkedIn OAuth
18. File Storage
Recommended
Cloudflare R2

Benefits:

S3 compatible
low cost
no egress fees

Used for:

exported PDFs
DOCX files
avatars
templates
19. Redis Usage
Use Redis ONLY For
caching
rate limiting
sessions
queues later

Do NOT:

store permanent resume data in Redis
20. Hosting Architecture
Recommended MVP Hosting
Docker
 ├── nginx
 ├── nextjs
 ├── postgres
 └── redis