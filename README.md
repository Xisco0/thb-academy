THB Academy

THB Academy is a modern web platform built with Next.js for managing and presenting educational programs, events, courses, student registration, and academy information.

The project uses the Next.js App Router and is designed with scalability, performance, responsiveness, SEO, and maintainability in mind.

Table of Contents

* Overview
* Features
* Technology Stack
* Project Structure
* Getting Started
* Environment Variables
* Development
* Building for Production
* Deployment
* Database
* Authentication
* SEO
* Images and Assets
* Code Quality
* Git Workflow
* Troubleshooting
* Useful Commands
* Project Status
* Contributing
* License

⸻

Overview

THB Academy provides a digital platform where visitors can learn about the academy, explore available programs, view events, and begin the registration process.

The platform is designed to support different types of users and administrative operations while providing a responsive experience across desktop, tablet, and mobile devices.

Main Areas

* Academy homepage
* About section
* Programs and courses
* Student registration
* Events and concerts
* Testimonials
* Contact information
* Student-facing features
* Administrative dashboard
* Program management
* Event management
* Student management
* Payment verification
* Notifications
* Role and permission management
* SEO-optimized public pages

⸻

Features

Public Website

* Responsive homepage
* Academy information
* Programs and courses
* Program levels
* Instructor information
* Events and concerts
* Image galleries
* Testimonials
* Contact information
* WhatsApp-based registration/payment communication
* Mobile-friendly navigation
* SEO-friendly page structure
* Social sharing metadata
* Open Graph images
* Responsive images and media

Programs

Programs can contain information such as:

* Program name
* Description
* Instrument/course
* Level
* Instructor
* Venue
* Duration
* Registration information

Supported levels can include:

* Beginner
* Intermediate
* Advanced

Registration

The registration workflow is designed to allow prospective students to:

1. Select a program.
2. Complete the registration form.
3. Receive payment instructions.
4. Submit payment proof.
5. Wait for administrative verification.
6. Receive notification after approval or rejection.

Events

Administrators can manage academy events, including:

* Event title
* Description
* Banner image
* Multiple event images
* Event information
* Concert information
* Event status

Administration

The administration system can provide functionality for:

* Dashboard overview
* Student management
* Program management
* Event management
* Payment verification
* Staff management
* Roles
* Permissions
* Notifications
* Settings

Role-Based Access Control

The platform supports different administrative roles.

Example roles include:

* Super Admin
* Admin
* Staff

Permissions can be configured according to the responsibilities of each role.

⸻

Technology Stack

Frontend

* Next.js
* React
* JavaScript / JSX / TypeScript where applicable
* Tailwind CSS
* CSS Modules
* HTML5
* CSS3

Backend / Data

Depending on the configured environment, the application can use:

* Supabase
* PostgreSQL
* REST APIs
* Laravel APIs

Authentication

Authentication can be handled through:

* Supabase Auth
* Session-based authentication
* Role-based authorization

Hosting

The frontend is optimized for deployment on:

* Vercel

Development Tools

* Node.js
* npm
* Git
* GitHub
* VS Code

⸻

Project Structure

The project uses the Next.js App Router architecture.

A typical structure looks like:

thb-academy/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── about/
│   ├── programs/
│   ├── events/
│   ├── contact/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── programs/
│   │   ├── events/
│   │   ├── payments/
│   │   ├── notifications/
│   │   └── settings/
│   │
│   └── api/
│
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── Hero/
│   ├── About/
│   ├── Programs/
│   ├── Events/
│   └── ...
│
├── lib/
│   ├── supabase/
│   ├── api/
│   ├── utilities/
│   └── ...
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ...
│
├── styles/
│
├── types/
│
├── hooks/
│
├── stores/
│
├── middleware.ts
├── next.config.js
├── package.json
├── .env.local
└── README.md

The exact structure may differ depending on the current implementation of the project.

⸻

Getting Started

1. Clone the repository

git clone <repository-url>

Navigate into the project:

cd thb-academy

2. Install dependencies

Using npm:

npm install

Or using Yarn:

yarn

Or pnpm:

pnpm install

3. Configure environment variables

Create a local environment file:

.env.local

Add the required environment variables.

See the Environment Variables section below.

4. Start the development server

npm run dev

Open:

http://localhost:3000

The application will automatically reload when files are modified.

⸻

Environment Variables

Environment variables should never be committed to Git.

Create:

.env.local

Example:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

If the project communicates with an external backend:

NEXT_PUBLIC_API_URL=your_api_url

Additional variables may be required depending on the project’s authentication, email, storage, or backend configuration.

Important

Never commit:

.env
.env.local
.env.production

or any file containing private credentials, API secrets, service-role keys, database passwords, or authentication secrets.

Public variables intended for browser use should use the NEXT_PUBLIC_ prefix.

⸻

Development

Run the development server:

npm run dev

The default development URL is:

http://localhost:3000

Development Workflow

A typical development workflow is:

Create feature
     ↓
Create Git branch
     ↓
Develop locally
     ↓
Test functionality
     ↓
Check mobile responsiveness
     ↓
Run production build
     ↓
Commit changes
     ↓
Push to GitHub
     ↓
Deploy through Vercel

⸻

Production Build

Before deploying, create a production build:

npm run build

Then start the production server:

npm start

This allows the application to be tested using the production build locally.

⸻

Deployment

The recommended deployment platform is Vercel.

Deploy with Vercel

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Import the GitHub repository.
4. Configure the required environment variables.
5. Deploy the project.

Every new production push can then trigger a new deployment depending on the configured Vercel settings.

Custom Domain

A custom domain can be connected through Vercel’s domain settings.

The DNS configuration should be completed according to the DNS provider and Vercel’s current instructions.

⸻

Database

If Supabase is being used, the project can use:

* PostgreSQL database
* Supabase Authentication
* Row Level Security
* Supabase Storage
* Database functions
* Database triggers

Database Development

Database schema changes should be handled through migrations where possible.

For Supabase CLI projects, common commands include:

npx supabase login

Link the local project:

npx supabase link --project-ref <project-ref>

Push database migrations:

npx supabase db push

Database seeding can be performed using the project’s configured seed process.

Row Level Security

Supabase Row Level Security should be enabled for tables containing protected data.

Policies should be designed around the application’s authorization requirements.

For example:

Public user
   ↓
Can view public content
Authenticated student
   ↓
Can view own protected data
Staff
   ↓
Can manage assigned resources
Admin
   ↓
Can manage administrative resources
Super Admin
   ↓
Full administrative access

⸻

Authentication

Authentication should be implemented separately from authorization.

Authentication

Authentication answers:

Who is the user?

Authorization

Authorization answers:

What is the user allowed to do?

For example:

User
 ├── Student
 ├── Staff
 ├── Admin
 └── Super Admin

Protected administrative routes should verify authentication and appropriate permissions before allowing access.

⸻

Middleware

If middleware is used, it should handle tasks such as:

* Route protection
* Authentication checks
* Redirecting unauthorized users
* Role-based access
* Session validation

Example protected routes:

/admin
/admin/dashboard
/admin/students
/admin/programs
/admin/events
/admin/settings

Public routes should remain accessible without authentication where appropriate.

⸻

SEO

SEO is an important part of the THB Academy website.

The project should provide:

* Unique page titles
* Meta descriptions
* Canonical URLs
* Open Graph metadata
* Twitter/X metadata
* Semantic HTML
* Structured headings
* Descriptive image alt text
* Sitemap
* Robots configuration
* Fast page loading
* Mobile responsiveness
* Clean URLs

Important SEO Files

The project may include:

app/sitemap.ts
app/robots.ts

These generate:

/sitemap.xml
/robots.txt

Search Engine Optimization Goals

The website should be optimized for searches related to:

* THB Academy
* Music academy
* Music lessons
* Music classes
* Instrument lessons
* Music school in Lagos
* Music academy in Nigeria
* Guitar lessons
* Keyboard lessons
* Trumpet lessons
* Saxophone lessons

SEO content should remain natural and useful rather than excessively repeating keywords.

⸻

Images and Assets

Static assets should generally be stored inside:

public/

For example:

public/
├── images/
│   ├── logo.png
│   ├── hero.jpg
│   ├── founders/
│   ├── programs/
│   └── events/
│
└── icons/

For Next.js image optimization, use:

import Image from "next/image";

Example:

<Image
  src="/images/hero.jpg"
  alt="THB Academy students performing music"
  width={1200}
  height={700}
/>

Large images should be optimized before being uploaded whenever possible.

⸻

Responsive Design

The application should support:

* Mobile phones
* Tablets
* Laptops
* Desktop monitors

Responsive testing should include:

320px
375px
390px
414px
768px
1024px
1280px+

Particular attention should be given to:

* Navigation
* Buttons
* Forms
* Modals
* Tables
* Dashboard sidebars
* Touch interactions
* Horizontal overflow
* Image sizes
* Text wrapping

⸻

Accessibility

The application should follow accessibility best practices.

Important considerations include:

* Semantic HTML
* Proper heading hierarchy
* Accessible buttons
* Keyboard navigation
* Form labels
* Meaningful alt text
* Sufficient color contrast
* Visible focus states
* Appropriate ARIA attributes where necessary

Interactive elements should use actual buttons or links rather than clickable non-semantic elements.

⸻

Performance

The application should take advantage of Next.js performance features where appropriate.

Recommended practices include:

* next/image
* Optimized fonts
* Server Components where appropriate
* Dynamic imports for heavy client-side components
* Avoiding unnecessary client components
* Avoiding unnecessary JavaScript
* Efficient database queries
* Pagination for large datasets
* Proper caching
* Image compression

Performance should be tested using tools such as Lighthouse and PageSpeed Insights.

⸻

Git Workflow

Create a new feature branch:

git checkout -b feature/feature-name

Check the current branch:

git branch

Check changes:

git status

Stage changes:

git add .

Commit:

git commit -m "feat: add program management"

Push the branch:

git push origin feature/feature-name

Recommended Commit Format

Use descriptive commits such as:

feat: add student registration
fix: resolve mobile navigation issue
fix: correct payment verification
refactor: improve program management
style: update homepage layout
docs: update README
perf: optimize event images
chore: update dependencies

⸻

Branch Strategy

A simple branch structure can be:

main
│
├── develop
│
├── feature/program-management
├── feature/student-registration
├── feature/event-management
├── feature/payment-verification
└── fix/mobile-navigation

Production-ready changes should be merged into the production branch according to the project’s deployment workflow.

⸻

Troubleshooting

Port 3000 is already in use

Start Next.js on another port:

npm run dev -- -p 3001

Then open:

http://localhost:3001

Dependencies are causing errors

Remove installed dependencies:

rm -rf node_modules

Remove the lock file only when necessary, then reinstall:

npm install

On Windows PowerShell:

Remove-Item -Recurse -Force node_modules
npm install

Clear the Next.js build cache

Remove:

.next/

Then restart:

npm run dev

Environment variables are not working

Check that:

1. .env.local exists in the project root.
2. Variable names are correct.
3. Browser-accessible variables use NEXT_PUBLIC_ where required.
4. The development server has been restarted after changing environment variables.
5. Production variables have also been added to Vercel.

Supabase authentication or RLS errors

Check:

* Authentication configuration
* User session
* Supabase policies
* Database roles
* Table permissions
* Authenticated user ID
* RLS policies

Do not disable RLS simply to bypass an authorization error.

⸻

Useful Commands

Install dependencies

npm install

Development

npm run dev

Production build

npm run build

Start production server

npm start

Lint

npm run lint

Git status

git status

Create a branch

git checkout -b feature/example

Push branch

git push origin feature/example

⸻

Recommended Development Checklist

Before opening a pull request or deploying:

* Application starts successfully.
* Production build succeeds.
* No major console errors.
* No broken links.
* Forms work correctly.
* Authentication works.
* Authorization works.
* Database operations work.
* RLS policies work as expected.
* Mobile layout has been tested.
* Desktop layout has been tested.
* Images have appropriate alt text.
* Large images are optimized.
* SEO metadata is present.
* Sitemap is working.
* Robots configuration is working.
* Environment variables are configured.
* No secrets are committed.
* Vercel production build succeeds.

⸻

Project Status

The THB Academy platform is actively developed.

Current development areas may include:

* Public website
* Student registration
* Program management
* Event management
* Administrative dashboard
* Payment verification
* Notifications
* Authentication
* Role and permission management
* SEO optimization
* Performance optimization
* Mobile responsiveness

⸻

Contributing

Contributions should follow the project’s development workflow.

Before submitting changes

1. Create a feature or fix branch.
2. Implement the change.
3. Test the change locally.
4. Test responsive layouts.
5. Run the production build.
6. Commit using a descriptive commit message.
7. Push the branch.
8. Open a pull request.

Keep changes focused and avoid mixing unrelated features into the same pull request.

⸻

Security

Never commit sensitive information to the repository.

This includes:

* Database passwords
* API secrets
* Service-role keys
* Authentication secrets
* Private tokens
* Production credentials

Use environment variables for sensitive configuration.

If a secret is accidentally committed, rotate/revoke it immediately rather than simply deleting it from the repository.

⸻

License

This project is proprietary software developed for THB Academy.

Unauthorized copying, redistribution, modification, or commercial use should not be performed without permission from the project owner.

⸻

Acknowledgements

This project is built with modern web technologies including:

* Next.js
* React
* Supabase
* PostgreSQL
* Tailwind CSS
* Vercel

For more information about the framework, see the official Next.js documentation.

For deployment information, see Vercel documentation.

⸻

Maintainer

THB Academy Development Team

The project is maintained and continuously improved to provide a reliable, scalable, and modern digital platform for THB Academy.
