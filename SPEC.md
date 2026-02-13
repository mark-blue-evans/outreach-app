# Email Outreach App - Specification

## Project Overview
- **Name:** Outreach Email Generator
- **Type:** Web Application (Next.js)
- **Core Functionality:** Display business contacts with generated email templates, allow copying/opening in email client
- **Target Users:** Radu (outreach agent)

## UI/UX Specification

### Layout Structure
- **Header:** App title + status
- **Main Content:** List of contacts with expandable email previews
- **Each Contact Card:**
  - Business Name, Email, Website, Business Type, City
  - Status badges (Initial Contact, Follow Up)
  - Expandable section with email templates
  - Action buttons

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design
- **Colors:**
  - Primary: #1e40af (blue-800)
  - Secondary: #64748b (slate-500)
  - Background: #f8fafc (slate-50)
  - Card: #ffffff
  - Success: #16a34a (green-600)
  - Warning: #ea580c (orange-600)
- **Typography:** Inter font, 14px base
- **Spacing:** 16px base unit
- **Border Radius:** 8px

### Components
1. **Contact Card**
   - Business info header
   - Status badges
   - Expand/collapse toggle
   
2. **Email Template Section**
   - Template name (The Hook / The Proof)
   - Subject line (copyable)
   - Body (copyable)
   - "Copy Subject" button
   - "Copy Body" button
   - "Open in Email" button (mailto: link)

3. **Filter/Search Bar**
   - Search by business name
   - Filter by city
   - Filter by status

## Database Schema (Neon/PostgreSQL)

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  "businessName" TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  "websiteGenerator" TEXT,
  "businessType" TEXT,
  city TEXT,
  "initialContact" TEXT DEFAULT 'No',
  "followUp" TEXT DEFAULT 'No',
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

## Functionality

### Core Features
1. **View Contacts** - List all contacts from DB
2. **Search/Filter** - Find contacts by name, city, status
3. **Generate Emails** - Pre-fill templates with business data
4. **Copy to Clipboard** - One-click copy for subject/body
5. **Open in Email Client** - mailto: link with subject + body

### Email Templates

**Template 1: The Hook**
- Subject: Question about ${businessType} | ${businessName}
- Body: Hi there, I was searching for a ${businessType} in ${city} today and came across the ${businessName} website. It looks a bit outdated and was difficult to navigate on mobile, which can cause potential customers to leave before they contact you. I build high-speed sites for local trades, so I created a fully functional demo (including Services, Gallery, and Reviews pages) as an example of what's possible with modern tech. I recorded a 30-second walkthrough. Would you like to see it? Best regards, Radu

**Template 2: The Proof**
- Subject: Here is the video – ${businessName} Demo
- Body: Hi again, Thanks for the reply! Here is the 30-second walkthrough I recorded for you: ${loomLink} This isn't just a website—it's a lead generation machine. It's built on the same technology as Netflix and Uber (Next.js), so it loads instantly on mobile and converts more visitors into paying customers. Would you like me to send the LIVE link so you can click around and test it yourself? Best, Radu

### User Interactions
- Click card to expand/collapse email templates
- Click copy buttons to copy to clipboard
- Click "Open in Email" to launch email client
- Search/filter updates list in real-time

## Acceptance Criteria
1. ✅ Contacts display from database
2. ✅ Email templates generate with correct business data
3. ✅ Copy buttons work for subject and body
4. ✅ "Open in Email" launches email client with pre-filled subject/body
5. ✅ Search/filter functionality works
6. ✅ Responsive design works on mobile
7. ✅ Deployed to Vercel and accessible
