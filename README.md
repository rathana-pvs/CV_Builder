# CV Online

Next.js SaaS resume builder based on `project_instruction.md`.

## Features

- Email/password authentication with Auth.js credentials
- Resume CRUD, duplicate, public/private sharing
- Resume sections: personal info, summary, skills, education, experience, projects, languages, certifications
- React resume templates: Modern, Minimal, Corporate, SEA Focus
- Live preview editor with Ant Design forms and Zustand state
- PDF export with Puppeteer
- DOCX export with Docxtemplater/PizZip
- Prisma/PostgreSQL data model
- Docker Compose with Next.js, Nginx, Postgres, and Redis

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:

```bash
npm install
```

3. Start Postgres and Redis:

```bash
docker compose up -d postgres redis
```

4. Run Prisma migration:

```bash
npx prisma migrate dev --name init
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Shape

The intended MVP deployment is:

```txt
nginx -> nextjs api/app -> postgres
                    -> redis
```

Cloudflare R2 can be added later for persisted generated files and uploaded assets.
# CV_Builder
