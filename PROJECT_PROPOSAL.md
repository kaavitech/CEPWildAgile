# CEP (CEP) - Project Proposal Document

## Executive Summary

The CEP (CEP) is a comprehensive web-based platform designed to facilitate eco-education programs for schools in collaboration with the Maharashtra Forest Department and WildAgile Foundation. The platform manages the entire lifecycle of eco-centre visits, from school registration and event planning to booking management and administrative oversight.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Basic Features](#basic-features)
4. [Add-On Features](#add-on-features)
5. [Future Use Cases](#future-use-cases)
6. [Recurring Costs & Third-Party Services](#recurring-costs--third-party-services)
7. [Development Costs](#development-costs)
8. [Feature Detailed Documentation](#feature-detailed-documentation)
9. [Admin Module Features](#admin-module-features)
10. [Booking System Features](#booking-system-features)
11. [Data Models & Interfaces](#data-models--interfaces)
12. [Implementation Phases](#implementation-phases)
13. [Stage Management System](#stage-management-system)

---

## Project Overview

### Purpose
The CEP platform connects schools with eco-centres to provide hands-on environmental education experiences. It streamlines event registration, resource management, booking operations, and administrative workflows.

### Key Stakeholders
- **Maharashtra Forest Department**: Manages eco-centres and approves events
- **WildAgile Foundation**: Coordinates programs and manages operations
- **Schools**: Register students for eco-education programs
- **Guest Lecturers**: Provide expertise during visits
- **Coordinators**: Manage event logistics
- **Bus Drivers**: Transport students safely

### Target Users
1. Public Users (Schools, Parents, General Public)
2. Administrators (Forest Officers, Program Coordinators)
3. Eco-Centre Managers
4. Guest Lecturers

---

## Technology Stack

### Frontend
- **React 18.3.1**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router DOM 6.30.1**: Navigation and routing
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Component library (Radix UI primitives)
- **date-fns 3.6.0**: Date manipulation and formatting
- **react-leaflet 4.2.1**: Interactive maps
- **leaflet 1.9.4**: Map library
- **qrcode.react 4.2.0**: QR code generation
- **react-hook-form 7.61.1**: Form handling
- **zod 3.25.76**: Schema validation
- **TanStack Query 5.83.0**: Server state management

### Backend (Current: Mock Data, Future: API Integration)
- **Mock Data Layer**: In-memory data structures
- **Recommended Backend**: Node.js/Express or Next.js API routes
- **Recommended Database**: PostgreSQL/SQLite with Prisma ORM

### Third-Party Services (Recurring Costs)
- **Map Services**: Leaflet (free) / Mapbox (paid - see costs section)
- **Payment Gateway**: Razorpay/Stripe (transaction fees)
- **Cloud Storage**: AWS S3 / Cloudinary (for images/documents)
- **Hosting**: Vercel/Netlify/AWS (hosting costs)
- **Email Service**: SendGrid/Mailgun (email notifications)

---

## Basic Features

### 1. Public-Facing Website

#### 1.1 Home Page (`/`)
- **Hero Section**: Program introduction with call-to-action buttons
- **Impact Counters**: Display key statistics (students reached, events completed, eco-centres)
- **Featured Eco-Centres**: Grid display of top eco-centres with images
- **Testimonials**: Student/school feedback carousel
- **Navigation**: Access to all public pages

#### 1.2 About Page (`/about`)
- **Program Overview**: Introduction to CEP
- **Vision & Mission**: Card-based display of organizational goals
- **Program Objectives**: List of key objectives
- **Program Workflow**: Accordion showing phases (Planning, Outreach, Execution)
- **Stakeholder Map**: Visual representation of key partners
- **Consistent Theming**: Gradient hero sections, content sections with background colors

#### 1.3 Eco-Centres Listing Page (`/eco-centres`)
- **Grid Display**: Cards for each eco-centre showing:
  - Thumbnail image
  - Name and location
  - Key features
  - Trail difficulty
  - "View Details" button (bottom-aligned)
- **Filtering**: Search by name or location (future enhancement)
- **Responsive Layout**: Mobile-friendly grid (1-3 columns based on screen size)

#### 1.4 Eco-Centre Detail Page (`/eco-centres/:id`)
- **Hero Carousel**: Multiple images with navigation arrows
- **Overview Section**: Description, location, capacity, trail difficulty
- **Features List**: Key amenities and facilities
- **Safety First Card**: Nearest hospital information with distance
- **Interactive Map**: Leaflet map showing eco-centre location and nearest hospital
- **YouTube Videos Section**: Embedded video player for promotional content (if available)
- **Official Website Preview**: Button to open official website in new tab
- **Activities Section** (Sidebar):
  - Compact display showing first 3 activities
  - "+X more" expand/collapse functionality
  - Photo tooltips on hover (thumbnail + details)
  - Photo dialog on click (full-size gallery)
- **Whole Day Package** (Sidebar):
  - Name, description, cost per student
  - Included activities list
- **Overnight Stay** (Sidebar):
  - Availability indicator
  - First 2 room types displayed
  - "+X more" expand/collapse functionality
  - Photo tooltips and dialog
- **Activity Calendar**:
  - Full month view with navigation (2 months back, 1 month ahead)
  - Color-coded date tiles:
    - **Red**: Fully booked by school
    - **Orange**: Partially booked by school
    - **Purple**: Guest lecture event
    - **Blue**: Partial activity bookings (some activities available)
    - **Green**: Available for booking
    - **Grey**: Not available (weekly off/holiday)
  - **Tooltips for Past Events**: 
    - Hover shows: thumbnail, school name, date, student count, lecturers, feedback summary
  - **Tooltips for Future Events**:
    - Hover shows: thumbnail, school name, date, student count, lecturers, available seats, "Book Now" button
  - **Event Details Dialog**:
    - Clicking a date opens comprehensive dialog with:
      - Full event details
      - Photo gallery (carousel)
      - Video embeds (if available)
      - Feedback and testimonials
      - Booking options for guest lectures

#### 1.5 School Registration Page (`/school/register`)
- **Multi-Step Form**:
  1. **School Information**:
     - School name (required)
     - Principal/Contact person (required)
     - Contact number (required)
     - Email address (required)
     - Number of students (required)
  2. **Visit Preferences**:
     - Preferred eco-centre dropdown (required)
     - Preferred dates calendar (multiple selection, future dates only)
     - Additional notes (optional)
  3. **Activity & Package Selection**:
     - Radio buttons: "Whole Day Package" or "Individual Activities"
     - If individual: Checkboxes for each activity with:
       - Activity name, description
       - Estimated time, cost per student
     - If whole day: Package details displayed
  4. **Overnight Stay** (if available):
     - Room type dropdown
     - Number of nights input
     - Auto-calculation of rooms needed based on student count
  5. **Cost Summary**:
     - Real-time calculation of total cost
     - Breakdown by activities/packages and overnight stay
  6. **Documents**:
     - Parent consent form upload (PDF, max 10MB, required)
- **Form Validation**: Real-time validation with error messages
- **Thank You Page**: Confirmation with event code (`/school/thank-you`)

#### 1.6 Guest Lecturers Page (`/lecturers`)
- **Lecturer Cards**: Grid display showing:
  - Profile photo
  - Name and expertise
  - Bio summary
  - Availability
- **Consistent Theming**: Matches About page styling

#### 1.7 Gallery Page (`/gallery`)
- **Image Grid**: Display of program photos
- **Categories** (future enhancement): Filter by eco-centre, event type

#### 1.8 Contact Page (`/contact`)
- **Contact Form**: Name, email, subject, message
- **Contact Information**: Phone, email, address
- **Map Integration** (future): Office location

#### 1.9 Execution Plan Page (`/execution-plan`)
- **Phases Display**: Detailed breakdown of program phases
- **Download Documents**:
  - Event Execution Plan (DOCX)
  - Master Tracker (XLSX)
  - Sample Event Summary (PDF)
  - Sample Parent Contacts (CSV)
- **Accordion Layout**: Expandable sections for each phase

### 2. Navigation & Layout

#### 2.1 Navbar Component
- **Logo**: Maharashtra Forest Department logo
- **Desktop Menu**: Home, About, Eco Centres, Guest Lecturers, Gallery, Execution Plan, Contact, Bookings, Admin
- **Mobile Menu**: Hamburger menu with same options
- **Direct Links**: "Eco Centre Bookings" button linking to admin bookings tab

#### 2.2 Footer Component
- **Organization Information**: WildAgile Foundation details
- **Quick Links**: Navigation links
- **Direct Admin Link**: "Eco Centre Bookings" link to `/admin?tab=bookings`

### 3. Booking System (Public)

#### 3.1 Bookings Listing Page (`/bookings`)
- **Hero Section**: Introduction to booking system
- **Activity Filter**: Dropdown to filter eco-centres by activity type
- **Eco-Centre Tiles**: Grid display with:
  - Eco-centre name and location
  - Number of activities available
  - Opening/closing times
  - **Full Month Calendar** (replica of eco-centre detail page):
    - Color-coded tiles for booking status
    - Month navigation (2 months back, 1 month ahead)
    - **Only shows current and future dates** (past dates hidden)
    - Previous month button disabled when viewing current month
    - Clickable dates redirect to activity details page
- **Search & Filter**: Filter by name, location, activity type

#### 3.2 Activity Details Page (`/bookings/:id`)
- **Eco-Centre Information**: Name, description, location, timings, contact
- **Date Selection**: Input field pre-filled from URL parameter
- **Participants Input**: Number of people
- **Divide Group Checkbox**: Option to allow splitting group into multiple slots
- **Package Type Selection**:
  - Radio buttons: "Individual Activities" or "Full Day Package"
  - If full day selected: Regular activities disabled, package details shown
  - Special event activities remain selectable
- **Activity Cards with Slot Windows**:
  - For slot-based activities: Selectable time slot buttons
  - Slots show: Start/end time, available capacity
  - Slots enabled/disabled based on:
    - Date selection
    - Participants count
    - Divide group option
    - Available capacity
  - Selected slots highlighted
- **Special Events Section**: Separated from regular activities
- **Booking Summary** (Sticky bottom card):
  - Selected activities list
  - Total cost calculation
  - Single "Book Now" button for all selections
- **Navigation**: Redirects to booking form with all selections stored in sessionStorage

#### 3.3 Booking Form Page (`/bookings/:ecoCentreId/:activityId`)
- **Multi-Activity Support**: Handles individual activities or full-day package
- **Form Fields**:
  - Name (required)
  - Mobile number (required)
  - Date (disabled for multi-activity/full-day bookings)
  - Number of participants (pre-filled from previous page)
  - Vehicles (for safari activities, required)
  - Slot selection (if applicable, pre-selected from previous page)
- **Activity Summary**: 
  - List of all selected activities
  - Slot details for each
  - Individual costs
- **Total Amount Calculation**: Sum of all selected activities
- **Submission**: Creates booking(s) and redirects to confirmation page
- **Data Persistence**: Reads from sessionStorage for multi-activity bookings

#### 3.4 Booking Confirmation Page (`/bookings/confirmation/:bookingId`)
- **Success Message**: Booking confirmed notification
- **Booking Details**:
  - Booking ID (e.g., "BK-2025-001")
  - Eco-centre name
  - Activity name(s)
  - Date and slot (if applicable)
  - Number of participants
  - Vehicle count (for safari)
  - Total amount
  - Payment status
- **QR Code**: Generated using `qrcode.react`, contains booking ID
- **Actions**:
  - Download Ticket (PDF generation - future enhancement)
  - Go Back to Bookings
  - Print Ticket (browser print functionality)

---

## Add-On Features

### 4. Advanced Admin Module

#### 4.1 Main Admin Dashboard (`/admin`)

**Tab-Based Navigation**:
- Events Management
- Schools Management
- Eco Centres Management
- Lecturers Management
- Coordinators Management
- Drivers Management
- Reports
- Eco Centre Bookings (sub-admin module)

**URL Parameter Support**: Direct linking via `/admin?tab=bookings`

##### 4.1.1 Events Management Tab
- **Events Table**: Displays all events with:
  - Event code
  - School name
  - Eco-centre name
  - Date
  - Student count
  - Consent forms submitted count
  - Status (Pending, Approved, Completed, Rejected)
  - Days remaining (calculated, color-coded: red for past, yellow for <7 days)
  - Actions (View Details, Approve, Reject)

- **Event Status Filters**: Pending, Approved, Completed, Rejected tabs

- **Event Detail Dialog** (for approved events):
  - **Basic Information**:
    - Event code, school name, eco-centre, date, student count
    - Consent forms submitted vs. total students
  - **Days Remaining Slider**: Visual representation of time until event
  - **Assignments**:
    - Coordinators: Multi-select dropdown to assign coordinators
    - Bus Driver: Single-select dropdown
    - Save assignments
  - **Teacher Details Table**:
    - Name, phone, email, role
    - Display all assigned teachers
  - **Emergency Contacts Table**:
    - Parent name, phone, student name
    - Display all emergency contacts
  - **Documents Table**:
    - Document name, type, upload date
    - Download links for each document
    - Upload new document button (file upload)
  - **Route Map**:
    - Interactive Leaflet map showing:
      - Start point (school location)
      - End point (eco-centre location)
      - Waypoints (hospitals and petrol stations)
      - Polyline route connecting all points
      - Distinct icons for hospitals and petrol stations
      - Click markers for names

##### 4.1.2 Schools Management Tab
- **Schools Table**: List all registered schools
- **CRUD Operations**:
  - View school details
  - Edit school information
  - Delete school (with confirmation)
- **School Details**: Name, contact person, phone, email, address, registered events

##### 4.1.3 Eco Centres Management Tab
- **Eco-Centres Table**: List all eco-centres
- **View Details**: Link to public eco-centre detail page

##### 4.1.4 Lecturers Management Tab
- **Lecturers Table**: List all guest lecturers
- **CRUD Operations**:
  - Add new lecturer (dialog form)
  - Edit lecturer details
  - Delete lecturer
- **Fields**: Name, expertise, phone, bio, availability, image

##### 4.1.5 Coordinators Management Tab
- **Coordinators Table**: List all coordinators
- **CRUD Operations**:
  - Add coordinator (dialog form)
  - Edit coordinator details
  - Delete coordinator
- **Fields**: Name, phone, email, role

##### 4.1.6 Drivers Management Tab
- **Drivers Table**: List all bus drivers
- **CRUD Operations**:
  - Add driver (dialog form)
  - Edit driver details
  - Delete driver
- **Fields**: Name, phone, license number, vehicle number, vehicle type

##### 4.1.7 Reports Tab
- **Event Reports**: 
  - Total events by status
  - Events by month
  - Student participation statistics
- **School Reports**: Schools by district
- **Export Options**: CSV/PDF export (future enhancement)

#### 4.2 Eco Centre Bookings Admin Module (`/admin?tab=bookings`)

**Sub-Tab Navigation**:
- Dashboard
- All Bookings
- Eco Centres
- Activities
- Reports

##### 4.2.1 Dashboard Tab
- **Key Metrics Cards**:
  - Total Bookings (all time)
  - Confirmed Bookings (active)
  - Total Revenue (completed payments)
  - Pending Payments (amount and count)
- **Recent Bookings Table**: Last 10 bookings with quick actions
- **Charts** (future enhancement):
  - Bookings trend over time
  - Revenue by eco-centre
  - Activity popularity

##### 4.2.2 All Bookings Tab
- **Filters**:
  - Search by booking ID, name, mobile
  - Filter by eco-centre
  - Filter by activity
  - Filter by status (confirmed, cancelled)
  - Filter by payment status (pending, completed)
  - Date range picker (start and end date)
- **Bookings Table**:
  - Booking ID
  - Eco-centre name
  - Activity name
  - Date and slot
  - Customer name and mobile
  - Participants count
  - Total amount
  - Payment status badge
  - Status badge
  - Actions: View, Confirm Payment, Cancel, Delete

- **Booking Detail Dialog**:
  - **Full Booking Information**:
    - Booking ID, eco-centre, activity, date, slot
    - Customer details (name, mobile)
    - Participants, vehicles (if applicable)
    - Total amount, payment status, booking status
  - **QR Code Display**: Same QR code as confirmation page
  - **Actions**:
    - Confirm Payment (updates payment status)
    - Cancel Booking (updates booking status)
    - Delete Booking (removes from system)
    - Download Ticket (PDF generation - future)
  - **Booking History** (future): Timeline of status changes

##### 4.2.3 Eco Centres Tab (Management)
- **Eco-Centres Table**:
  - Name, Location (district, state)
  - Capacity, Activities Count
  - Opening Hours, Weekly Off Days
  - Actions: Edit, Settings, Delete

- **Add Eco Centre Dialog**:
  - **Basic Information**:
    - Name, Description
    - Location: Address, District, State, Coordinates (lat/lng)
  - **Hospital Details**:
    - Hospital name, phone, coordinates, distance
  - **Contact Information**:
    - Phone, email
  - **Operating Hours**:
    - Opening time, closing time
    - Weekly off days (multi-select checkboxes)
  - **Images Upload**: Multiple images
  - Save button with validation

- **Edit Eco Centre Dialog**:
  - Pre-filled form with existing eco-centre data
  - Same fields as Add dialog
  - Update functionality

- **Eco Centre Settings Dialog**:
  - Focus on booking-specific settings:
    - Opening/closing times
    - Weekly off days
    - Quick update without full edit

- **Delete Eco Centre**:
  - Confirmation dialog
  - Prevents deletion if bookings exist (validation)

##### 4.2.4 Activities Tab (Management)
- **Activities Table**:
  - Activity name, Eco-centre name
  - Type (FREE/PAID), Price
  - Slot-based (Yes/No), Capacity
  - Number of slots (if slot-based)
  - Actions: Edit, Settings (for slots), Delete

- **Filters**:
  - Search by activity name
  - Filter by eco-centre

- **Add Activity Dialog**:
  - **Basic Information**:
    - Name, Description
    - Eco-centre association (dropdown)
  - **Activity Type**:
    - FREE or PAID (radio buttons)
    - Price (required if PAID)
  - **Capacity & Scheduling**:
    - Slot-based toggle (checkbox)
    - Daily capacity (if not slot-based)
    - Slot-wise capacity (if slot-based)
  - **Age Restrictions** (optional):
    - Text input (e.g., "12+ years")
  - **Vehicle Requirements** (for safari):
    - Requires vehicles (checkbox)
    - Vehicle capacity (default 6)
  - **Slot Management** (if slot-based):
    - Dynamic slot list
    - Add slot button:
      - Start time, end time
      - Max capacity
    - Edit/Delete existing slots
  - **Photos Upload**: Multiple images
  - Save with validation

- **Edit Activity Dialog**:
  - Pre-filled form with existing activity data
  - Same fields as Add dialog
  - Update slots within edit dialog

- **Activity Slot Management Dialog** (dedicated):
  - Focus on slot management:
    - List of all slots
    - Add new slot (time range, capacity)
    - Edit existing slot
    - Delete slot (with validation for existing bookings)
  - Used when clicking "Settings" button in table

- **Delete Activity**:
  - Confirmation dialog
  - Prevents deletion if bookings exist

##### 4.2.5 Reports Tab
- **Financial Summary**:
  - Total Revenue (all time)
  - Completed Payments total
  - Pending Payments total
- **Revenue by Eco Centre**:
  - Table/chart showing revenue breakdown
  - Percentage of total
- **Revenue by Activity**:
  - Table/chart showing activity popularity and revenue
- **Export Options** (future):
  - CSV export for financial data
  - PDF reports

### 5. Advanced UI Features

#### 5.1 Interactive Maps (Leaflet)
- **Eco-Centre Detail Maps**: Show eco-centre and nearest hospital
- **Admin Route Maps**: 
  - School to eco-centre route
  - Waypoints (hospitals, petrol stations)
  - Polylines connecting points
  - Custom icons for different waypoint types
- **Map Styling**: Consistent theming, responsive sizing

#### 5.2 Photo Management
- **Tooltips on Hover**: 
  - Activities: Small thumbnail (128x96px) + details
  - Rooms: Same thumbnail display
- **Photo Dialogs on Click**:
  - Full-size image gallery
  - Carousel navigation (previous/next)
  - Multiple photos support
  - Photo titles/descriptions

#### 5.3 Calendar Features
- **Month-Wise View**: Full calendar month display
- **Date Navigation**: 
  - Previous month button (2 months back)
  - Next month button (1 month ahead)
  - Current month indicator
  - Disabled previous button when viewing current month
- **Color Coding**: 
  - Different colors for booking statuses
  - Visual feedback for availability
- **Interactive Tooltips**: 
  - Rich content on hover
  - Images, details, actions
- **Event Dialogs**: 
  - Comprehensive event information
  - Photo/video galleries
  - Booking options

#### 5.4 QR Code Generation
- **Booking Confirmation**: QR code on confirmation page
- **Admin View**: QR code in booking detail dialog
- **QR Code Content**: Booking ID for verification
- **Library**: `qrcode.react` for SVG generation

### 6. Data Management

#### 6.1 Mock Data Structure
- **In-Memory Storage**: Currently using mock data arrays
- **Data Interfaces**: TypeScript interfaces for type safety
- **Helper Functions**: CRUD operations for bookings, eco-centres, activities

#### 6.2 Session Storage
- **Multi-Activity Bookings**: Store booking data between pages
- **Data Structure**: JSON serialization
- **Cleanup**: Data cleared after successful booking

---

## Future Use Cases

### 1. Payment Gateway Integration
- **Payment Methods**: 
  - Credit/Debit cards
  - UPI (Google Pay, PhonePe, Paytm)
  - Net banking
  - Wallets
- **Payment Gateway Options**:
  - Razorpay (India-focused, low transaction fees)
  - Stripe (International, higher fees)
- **Features**:
  - Secure payment processing
  - Payment status tracking
  - Refund management
  - Payment history
- **Recurring Cost**: Transaction fees (1-3% per transaction)

### 2. Email Notifications
- **Service Options**:
  - SendGrid (recommended for scalability)
  - Mailgun (alternative)
  - AWS SES (cost-effective for high volume)
- **Notification Types**:
  - Booking confirmation emails
  - Payment receipt emails
  - Event reminder emails
  - Admin notifications (new bookings, payments)
  - Password reset emails
- **Email Templates**: 
  - HTML templates with branding
  - Dynamic content insertion
- **Recurring Cost**: Based on email volume (e.g., $0.10 per 1,000 emails for SendGrid)

### 3. SMS Notifications
- **Service Options**:
  - Twilio (international)
  - MSG91 (India-focused, cheaper)
  - AWS SNS (cost-effective)
- **Notification Types**:
  - Booking confirmation SMS
  - Payment confirmation SMS
  - Event reminder SMS
  - OTP for login/verification
- **Recurring Cost**: Per SMS pricing (e.g., ₹0.20-0.50 per SMS in India)

### 4. Cloud Storage for Media
- **Service Options**:
  - AWS S3 (scalable, reliable)
  - Cloudinary (image optimization built-in)
  - Google Cloud Storage
- **Storage Types**:
  - Eco-centre images
  - Activity photos
  - Room photos
  - Event photos/videos
  - Documents (consent forms, permissions)
- **Features**:
  - Image optimization/resizing
  - CDN for fast delivery
  - Automatic backup
- **Recurring Cost**: Based on storage and bandwidth (e.g., $0.023 per GB storage + $0.09 per GB transfer for S3)

### 5. User Authentication & Authorization
- **Features**:
  - Admin login/logout
  - Role-based access control (RBAC)
  - School account creation
  - Password reset functionality
  - Two-factor authentication (2FA)
- **Authentication Methods**:
  - Email/password
  - OTP via SMS/Email
  - Social login (Google, Facebook - optional)

### 6. Real-Time Notifications
- **Service Options**:
  - Socket.io (WebSocket server)
  - Firebase Cloud Messaging (FCM)
  - Pusher (hosted service)
- **Use Cases**:
  - New booking notifications for admins
  - Payment status updates
  - Event status changes
  - Available slot notifications
- **Recurring Cost**: Based on connection/message volume (e.g., Pusher: $49/month for 200K messages)

### 7. Advanced Analytics & Reporting
- **Features**:
  - Dashboard with charts and graphs
  - Revenue analytics
  - Booking trends analysis
  - Eco-centre performance metrics
  - Activity popularity analysis
  - Customer demographics
- **Tools Integration**:
  - Google Analytics (free)
  - Custom analytics dashboard
  - Export to Excel/PDF
- **Recurring Cost**: Google Analytics free, custom analytics may require additional hosting

### 8. Multi-Language Support
- **Languages**: 
  - English (default)
  - Marathi (regional)
  - Hindi (optional)
- **Implementation**:
  - i18n library (react-i18next)
  - Language switcher in navbar
  - Translated content for all pages

### 9. Mobile App (React Native)
- **Features**:
  - Native mobile experience
  - Push notifications
  - Offline booking capability
  - QR code scanning for check-in
  - Location-based services
- **Platforms**: iOS and Android
- **Recurring Cost**: App store fees ($99/year for Apple, $25 one-time for Google)

### 10. Integration with External Systems
- **Forest Department Systems**: 
  - API integration for permission workflows
  - Document verification
- **School Management Systems**: 
  - Student data import
  - Bulk registration
- **Transport Management**: 
  - Bus tracking integration
  - Route optimization

### 11. Advanced Booking Features
- **Waitlist Management**: 
  - Queue for fully booked dates
  - Auto-notification when slots open
- **Group Bookings**: 
  - Bulk booking for multiple dates
  - Group discounts
- **Recurring Bookings**: 
  - Weekly/monthly recurring visits
  - Automatic booking creation

### 12. Feedback & Reviews System
- **Features**:
  - Post-event feedback forms
  - Rating system (1-5 stars)
  - Review display on eco-centre pages
  - Admin moderation
  - Photo uploads in reviews

### 13. Content Management System (CMS)
- **Features**:
  - Admin can edit content without code changes
  - Manage eco-centre descriptions
  - Update activity details
  - Upload/manage images and videos
- **Options**:
  - Strapi (open-source headless CMS)
  - Custom CMS built into admin panel

### 14. Inventory Management
- **Features**:
  - Track equipment availability
  - Resource allocation for events
  - Maintenance scheduling
  - Inventory reports

### 15. Certificate Generation
- **Features**:
  - Auto-generate participation certificates
  - Customizable templates
  - PDF download
  - Email delivery

---

## Recurring Costs & Third-Party Services

### Essential Services (Recommended for Production)

| Service | Provider | Estimated Monthly Cost | Notes |
|---------|----------|----------------------|-------|
| **Hosting** | Vercel/Netlify | $0-$20 | Free tier available, paid for custom domains & higher limits |
| **Database** | PostgreSQL (Supabase/Railway) | $0-$25 | Free tier available, paid for production |
| **Payment Gateway** | Razorpay | Transaction-based (1-2%) | No monthly fee, only transaction fees |
| **Email Service** | SendGrid | $0-$15 | Free tier: 100 emails/day, paid: $15/month for 40K emails |
| **SMS Service** | MSG91 | ₹0.20-0.50/SMS | Pay-as-you-go, estimated ₹500-2000/month |
| **Cloud Storage** | AWS S3 / Cloudinary | $5-$20 | Based on storage & bandwidth usage |
| **Maps** | Leaflet (Free) / Mapbox | $0-$50 | Leaflet free, Mapbox: $0.50 per 1K loads (first 50K free) |
| **Analytics** | Google Analytics | $0 | Free tier sufficient for most use cases |
| **Domain** | Any registrar | ₹800-1500/year | One-time annual cost |
| **SSL Certificate** | Let's Encrypt | $0 | Free SSL via hosting provider |

### Optional Services (For Enhanced Features)

| Service | Provider | Estimated Monthly Cost | Notes |
|---------|----------|----------------------|-------|
| **Real-Time Notifications** | Pusher | $49-$299 | Based on message volume |
| **Image CDN** | Cloudinary | $0-$89 | Free tier: 25GB storage, paid for more |
| **Monitoring** | Sentry | $0-$26 | Free tier: 5K events/month |
| **Backup Service** | AWS Backup | $5-$10 | Automated database backups |

### Cost Breakdown Example (Medium-Scale Operation)

**Monthly Operating Costs (Estimated)**:
- Hosting: $20
- Database: $25
- Payment Gateway: Transaction-based (1-2% of revenue)
- Email Service: $15
- SMS Service: ₹1,500 (~$20)
- Cloud Storage: $10
- Maps: $0 (using free Leaflet)
- **Total Fixed Cost**: ~$90/month (~₹7,200/month)
- **Variable Costs**: Payment gateway fees (1-2% of revenue), SMS usage

**Annual Costs**:
- Fixed services: ~$1,080/year (~₹86,400/year)
- Domain: ~₹1,200/year
- **Total Annual**: ~₹87,600/year

---

## Development Costs

### Development Team Structure

| Role | Level | Hourly Rate (USD) | Hourly Rate (INR) | Notes |
|------|-------|------------------|-------------------|-------|
| **Frontend Developer** | Senior | $35-$50 | ₹2,800-₹4,000 | React, TypeScript, UI/UX |
| **Frontend Developer** | Mid-level | $25-$35 | ₹2,000-₹2,800 | React, TypeScript |
| **Backend Developer** | Senior | $40-$60 | ₹3,200-₹4,800 | Node.js, Database design |
| **Backend Developer** | Mid-level | $30-$40 | ₹2,400-₹3,200 | Node.js, API development |
| **UI/UX Designer** | Senior | $40-$60 | ₹3,200-₹4,800 | Design system, mockups |
| **QA Engineer** | Mid-level | $20-$30 | ₹1,600-₹2,400 | Testing, bug fixes |
| **DevOps Engineer** | Senior | $45-$65 | ₹3,600-₹5,200 | Deployment, CI/CD |
| **Project Manager** | Senior | $50-$70 | ₹4,000-₹5,600 | Coordination, planning |

### Development Phases & Costs

#### Phase 1: Basic Features (Completed)
**Duration**: 4-6 weeks  
**Status**: ✅ Completed

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Project Setup & Architecture | Senior Frontend Dev | 20 | ₹3,500 | ₹70,000 |
| Home, About, Gallery Pages | Mid Frontend Dev | 40 | ₹2,400 | ₹96,000 |
| Eco-Centres Listing & Detail | Senior Frontend Dev | 50 | ₹3,500 | ₹1,75,000 |
| School Registration Form | Mid Frontend Dev | 35 | ₹2,400 | ₹84,000 |
| Guest Lecturers Page | Mid Frontend Dev | 15 | ₹2,400 | ₹36,000 |
| Execution Plan Page | Mid Frontend Dev | 15 | ₹2,400 | ₹36,000 |
| Contact Page | Mid Frontend Dev | 10 | ₹2,400 | ₹24,000 |
| Navbar & Footer Components | Mid Frontend Dev | 20 | ₹2,400 | ₹48,000 |
| UI/UX Design | Senior Designer | 60 | ₹4,000 | ₹2,40,000 |
| Testing & Bug Fixes | QA Engineer | 40 | ₹2,000 | ₹80,000 |
| **Subtotal** | | **305** | | **₹8,89,000** |

#### Phase 2: Booking System (Completed)
**Duration**: 3-4 weeks  
**Status**: ✅ Completed

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Booking Listing Page with Calendar | Senior Frontend Dev | 40 | ₹3,500 | ₹1,40,000 |
| Activity Details Page | Senior Frontend Dev | 35 | ₹3,500 | ₹1,22,500 |
| Booking Form (Multi-activity) | Senior Frontend Dev | 45 | ₹3,500 | ₹1,57,500 |
| Booking Confirmation Page | Mid Frontend Dev | 20 | ₹2,400 | ₹48,000 |
| QR Code Integration | Mid Frontend Dev | 10 | ₹2,400 | ₹24,000 |
| Calendar Component Development | Senior Frontend Dev | 30 | ₹3,500 | ₹1,05,000 |
| Slot Management Logic | Senior Frontend Dev | 25 | ₹3,500 | ₹87,500 |
| Testing & Bug Fixes | QA Engineer | 35 | ₹2,000 | ₹70,000 |
| **Subtotal** | | **240** | | **₹7,54,000** |

#### Phase 3: Advanced Admin Features (Completed)
**Duration**: 4-5 weeks  
**Status**: ✅ Completed

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Main Admin Dashboard | Senior Frontend Dev | 50 | ₹3,500 | ₹1,75,000 |
| Events Management Tab | Senior Frontend Dev | 40 | ₹3,500 | ₹1,40,000 |
| Route Map Integration | Senior Frontend Dev | 30 | ₹3,500 | ₹1,05,000 |
| Coordinators & Drivers Management | Mid Frontend Dev | 30 | ₹2,400 | ₹72,000 |
| Eco Centre Bookings Admin Module | Senior Frontend Dev | 80 | ₹3,500 | ₹2,80,000 |
| Eco Centres Management (CRUD) | Senior Frontend Dev | 40 | ₹3,500 | ₹1,40,000 |
| Activities Management (CRUD) | Senior Frontend Dev | 45 | ₹3,500 | ₹1,57,500 |
| Reports & Analytics | Senior Frontend Dev | 35 | ₹3,500 | ₹1,22,500 |
| Document Management | Mid Frontend Dev | 20 | ₹2,400 | ₹48,000 |
| Testing & Bug Fixes | QA Engineer | 50 | ₹2,000 | ₹1,00,000 |
| **Subtotal** | | **420** | | **₹13,40,000** |

#### Phase 4: Backend Integration (Future)
**Duration**: 6-8 weeks  
**Status**: 🔜 Planned

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Database Design & Schema | Senior Backend Dev | 40 | ₹4,000 | ₹1,60,000 |
| API Development (REST/GraphQL) | Senior Backend Dev | 100 | ₹4,000 | ₹4,00,000 |
| Authentication & Authorization | Senior Backend Dev | 50 | ₹4,000 | ₹2,00,000 |
| File Upload System | Mid Backend Dev | 30 | ₹2,800 | ₹84,000 |
| Data Migration Scripts | Senior Backend Dev | 30 | ₹4,000 | ₹1,20,000 |
| API Documentation | Mid Backend Dev | 20 | ₹2,800 | ₹56,000 |
| Frontend API Integration | Senior Frontend Dev | 60 | ₹3,500 | ₹2,10,000 |
| DevOps Setup (CI/CD) | DevOps Engineer | 40 | ₹4,400 | ₹1,76,000 |
| Testing (API + Integration) | QA Engineer | 60 | ₹2,000 | ₹1,20,000 |
| **Subtotal** | | **430** | | **₹15,26,000** |

#### Phase 5: Payment Integration (Future)
**Duration**: 2-3 weeks  
**Status**: 🔜 Planned

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Payment Gateway Integration | Senior Backend Dev | 40 | ₹4,000 | ₹1,60,000 |
| Payment Status Tracking | Mid Backend Dev | 25 | ₹2,800 | ₹70,000 |
| Frontend Payment UI | Senior Frontend Dev | 30 | ₹3,500 | ₹1,05,000 |
| Refund Management | Senior Backend Dev | 20 | ₹4,000 | ₹80,000 |
| Payment Receipt Generation | Mid Backend Dev | 15 | ₹2,800 | ₹42,000 |
| Testing & Security Audit | QA Engineer | 30 | ₹2,000 | ₹60,000 |
| **Subtotal** | | **160** | | **₹5,17,000** |

#### Phase 6: Notifications (Future)
**Duration**: 2-3 weeks  
**Status**: 🔜 Planned

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Email Service Integration | Senior Backend Dev | 30 | ₹4,000 | ₹1,20,000 |
| SMS Service Integration | Mid Backend Dev | 25 | ₹2,800 | ₹70,000 |
| Email Template Design | Senior Designer | 20 | ₹4,000 | ₹80,000 |
| Notification Queue System | Senior Backend Dev | 35 | ₹4,000 | ₹1,40,000 |
| Real-time Notifications (WebSocket) | Senior Backend Dev | 40 | ₹4,000 | ₹1,60,000 |
| Frontend Notification UI | Mid Frontend Dev | 25 | ₹2,400 | ₹60,000 |
| Testing | QA Engineer | 20 | ₹2,000 | ₹40,000 |
| **Subtotal** | | **195** | | **₹6,70,000** |

#### Phase 7: Advanced Features (Future)
**Duration**: 8-10 weeks  
**Status**: 🔜 Planned

| Task | Resource | Hours | Rate (INR/hr) | Cost (INR) |
|------|----------|-------|---------------|------------|
| Multi-language Support (i18n) | Senior Frontend Dev | 40 | ₹3,500 | ₹1,40,000 |
| Content Translation | Translator | 60 | ₹1,000 | ₹60,000 |
| Advanced Analytics Dashboard | Senior Frontend Dev | 50 | ₹3,500 | ₹1,75,000 |
| Analytics Backend | Senior Backend Dev | 40 | ₹4,000 | ₹1,60,000 |
| Feedback & Reviews System | Senior Frontend Dev | 45 | ₹3,500 | ₹1,57,500 |
| Feedback Backend | Mid Backend Dev | 30 | ₹2,800 | ₹84,000 |
| CMS Development | Senior Backend Dev | 60 | ₹4,000 | ₹2,40,000 |
| CMS Frontend | Senior Frontend Dev | 40 | ₹3,500 | ₹1,40,000 |
| Certificate Generation | Mid Backend Dev | 25 | ₹2,800 | ₹70,000 |
| Waitlist Management | Senior Frontend Dev | 30 | ₹3,500 | ₹1,05,000 |
| Testing | QA Engineer | 50 | ₹2,000 | ₹1,00,000 |
| **Subtotal** | | **470** | | **₹13,31,500** |

### Total Development Cost Summary

| Phase | Status | Duration | Total Hours | Total Cost (INR) | Total Cost (USD) |
|-------|--------|----------|-------------|------------------|------------------|
| Phase 1: Basic Features | ✅ Completed | 4-6 weeks | 305 | ₹8,89,000 | ~$11,100 |
| Phase 2: Booking System | ✅ Completed | 3-4 weeks | 240 | ₹7,54,000 | ~$9,400 |
| Phase 3: Advanced Admin | ✅ Completed | 4-5 weeks | 420 | ₹13,40,000 | ~$16,750 |
| Phase 4: Backend Integration | 🔜 Planned | 6-8 weeks | 430 | ₹15,26,000 | ~$19,075 |
| Phase 5: Payment Integration | 🔜 Planned | 2-3 weeks | 160 | ₹5,17,000 | ~$6,460 |
| Phase 6: Notifications | 🔜 Planned | 2-3 weeks | 195 | ₹6,70,000 | ~$8,375 |
| Phase 7: Advanced Features | 🔜 Planned | 8-10 weeks | 470 | ₹13,31,500 | ~$16,640 |
| **TOTAL** | | **29-39 weeks** | **2,220** | **₹70,27,500** | **~$87,800** |

**Note**: Exchange rate used: 1 USD = ₹80 (approximate)

### Additional Development Costs

| Item | Cost (INR) | Cost (USD) | Notes |
|------|------------|------------|-------|
| **Project Management** (10% of dev cost) | ₹7,02,750 | ~$8,780 | Coordination, planning, reporting |
| **Design System & UI Kit** | ₹2,00,000 | ~$2,500 | Reusable component library |
| **Third-Party Licenses** | ₹50,000 | ~$625 | Premium libraries, tools (if required) |
| **Contingency Buffer** (10%) | ₹7,98,025 | ~$9,975 | Unforeseen issues, scope changes |
| **Subtotal (Additional)** | **₹17,50,775** | **~$21,880** | |

### Complete Development Cost Breakdown

| Category | Cost (INR) | Cost (USD) | Percentage |
|----------|------------|------------|------------|
| **Core Development** | ₹70,27,500 | ~$87,800 | 80.0% |
| **Project Management** | ₹7,02,750 | ~$8,780 | 8.0% |
| **Design System** | ₹2,00,000 | ~$2,500 | 2.3% |
| **Third-Party Licenses** | ₹50,000 | ~$625 | 0.6% |
| **Contingency** | ₹7,98,025 | ~$9,975 | 9.1% |
| **TOTAL DEVELOPMENT COST** | **₹87,78,275** | **~$109,680** | **100%** |

### Development Timeline Summary

| Phase | Start Week | End Week | Duration |
|-------|------------|----------|----------|
| Phase 1: Basic Features | Week 1 | Week 6 | 6 weeks |
| Phase 2: Booking System | Week 7 | Week 10 | 4 weeks |
| Phase 3: Advanced Admin | Week 11 | Week 15 | 5 weeks |
| Phase 4: Backend Integration | Week 16 | Week 23 | 8 weeks |
| Phase 5: Payment Integration | Week 24 | Week 26 | 3 weeks |
| Phase 6: Notifications | Week 27 | Week 29 | 3 weeks |
| Phase 7: Advanced Features | Week 30 | Week 39 | 10 weeks |
| **TOTAL PROJECT DURATION** | **Week 1** | **Week 39** | **~9-10 months** |

**Note**: Timeline assumes parallel work where possible (e.g., backend and frontend work can overlap). Actual timeline may vary based on team size and availability.

### Ongoing Maintenance & Support Costs

After project completion, ongoing maintenance and support costs:

| Service | Monthly Cost (INR) | Annual Cost (INR) | Notes |
|---------|-------------------|-------------------|-------|
| **Bug Fixes & Minor Updates** | ₹50,000 | ₹6,00,000 | 20 hours/month @ ₹2,500/hr avg |
| **Feature Enhancements** | ₹1,00,000 | ₹12,00,000 | 40 hours/month @ ₹2,500/hr avg |
| **Security Updates** | ₹25,000 | ₹3,00,000 | 10 hours/month |
| **Performance Monitoring** | ₹15,000 | ₹1,80,000 | Tools and monitoring |
| **Support & Training** | ₹30,000 | ₹3,60,000 | User support, documentation |
| **TOTAL (Monthly)** | **₹2,20,000** | **₹26,40,000** | **~$27,500/year** |

### Support Packages

| Package | Monthly Hours | Monthly Cost (INR) | Monthly Cost (USD) | Includes |
|---------|---------------|-------------------|-------------------|----------|
| **Basic Support** | 20 hours | ₹50,000 | ~$625 | Bug fixes, minor updates, email support |
| **Standard Support** | 40 hours | ₹1,00,000 | ~$1,250 | Basic + feature enhancements, priority support |
| **Premium Support** | 60 hours | ₹1,50,000 | ~$1,875 | Standard + 24/7 support, dedicated developer |

---

## Feature Detailed Documentation

### Data Models & Interfaces

#### Core Interfaces

```typescript
// Eco-Centre Model
interface EcoCentre {
  id: string;
  name: string;
  location: { lat: number; lng: number; address: string; district?: string; state?: string };
  capacity: number;
  trailDifficulty: 'Easy' | 'Moderate' | 'Difficult';
  nearestHospital: { name: string; phone: string; coords: { lat: number; lng: number }; distance_km: number };
  images: string[];
  description: string;
  features: string[];
  youtubeVideoUrl?: string[];
  officialWebsiteUrl?: string;
  activities?: Activity[];
  wholeDayPackage?: WholeDayPackage;
  overnightStay?: { available: boolean; rooms?: OvernightRoom[] };
  openingTime?: string;
  closingTime?: string;
  weeklyOffDays?: string[];
  contactInfo?: { phone: string; email: string };
  bookingActivities?: BookingActivity[];
}

// Activity Model
interface Activity {
  id: string;
  name: string;
  estimatedTime: string;
  cost: number;
  description?: string;
  photos?: string[];
}

// Booking Activity Model (for booking system)
interface BookingActivity {
  id: string;
  ecoCentreId: string;
  name: string;
  type: 'FREE' | 'PAID';
  isSlotBased: boolean;
  price?: number;
  capacity: number;
  ageRestrictions?: string;
  description?: string;
  slots?: ActivitySlot[];
  requiresVehicles?: boolean;
  vehicleCapacity?: number;
  photos?: string[];
}

// Booking Model
interface Booking {
  id: string;
  bookingId: string;
  ecoCentreId: string;
  activityId: string;
  date: string;
  slotId?: string;
  name: string;
  mobile: string;
  participants: number;
  vehicles?: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed';
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

// Event Model
interface Event {
  id: string;
  code: string;
  schoolId?: string;
  ecoCentreId: string;
  date: string;
  students_count: number;
  consentFormsSubmitted: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  eventType?: 'school' | 'guest_lecture';
  availableSeats?: number;
  bookedActivities?: string[];
  isFullyBooked?: boolean;
  isPartiallyBooked?: boolean;
  assignedCoordinators: string[];
  assignedDriverId?: string;
  lecturerIds: string[];
  teachers: Teacher[];
  emergencyContacts: ParentContact[];
  route?: { startPoint: RoutePoint; endPoint: RoutePoint; waypoints: RouteWaypoint[] };
  documents: EventDocument[];
  photos: string[];
  feedbackSummary?: string;
}
```

### User Roles & Permissions (Future)

1. **Super Admin**: Full system access
2. **Forest Officer**: Approve/reject events, view reports
3. **Coordinator**: Manage assigned events, view bookings
4. **Eco-Centre Manager**: Manage eco-centre details, view bookings
5. **School Admin**: Register events, view own bookings
6. **Guest Lecturer**: View assigned events, update availability

---

## Implementation Phases

### Phase 1: Basic Features (Completed)
- ✅ Public-facing website (Home, About, Eco-Centres, Gallery, Contact)
- ✅ School registration system
- ✅ Eco-centre detail pages with calendars
- ✅ Guest lecturers page
- ✅ Execution plan page
- ✅ Basic admin module (events, schools, lecturers)

### Phase 2: Booking System (Completed)
- ✅ Bookings listing page with calendars
- ✅ Activity details page with slot selection
- ✅ Booking form with multi-activity support
- ✅ Booking confirmation with QR code
- ✅ Eco Centre Bookings Admin module

### Phase 3: Advanced Admin Features (Completed)
- ✅ Event detail dialog with route maps
- ✅ Coordinator and driver management
- ✅ Document management
- ✅ Eco-centre management (CRUD)
- ✅ Activity management (CRUD)
- ✅ Reports and analytics

### Phase 4: Backend Integration (Future)
- Database setup (PostgreSQL/SQLite)
- API development (REST/GraphQL)
- Authentication & authorization
- Real data persistence
- File upload handling

### Phase 5: Payment Integration (Future)
- Payment gateway integration (Razorpay/Stripe)
- Payment status tracking
- Refund management
- Payment receipts

### Phase 6: Notifications (Future)
- Email notifications (SendGrid)
- SMS notifications (MSG91)
- Real-time notifications (Socket.io/Pusher)

### Phase 7: Advanced Features (Future)
- User authentication system
- Multi-language support
- Mobile app development
- Advanced analytics

---

## Stage Management System

### Overview

The CEP platform implements a **3-stage rollout system** that allows administrators to control which features and screens are available on the portal. This enables gradual feature deployment, testing, and user adoption.

### Stage Configuration

The platform is divided into **3 stages**, each containing specific screens, features, and routes:

#### **Stage 1: Foundation** (Always Enabled)
**Status**: ✅ Always Active (Cannot be disabled)

**Description**: Basic public-facing website and core booking functionality

**Screens (20)**:
1. Home
2. About
3. Eco-Centres Listing
4. Eco-Centre Detail
5. School Registration
6. Thank You
7. Contact
8. Gallery
9. Guest Lecturers
10. Execution Plan
11. Bookings Listing
12. Activity Details
13. Booking Form (Single Activity)
14. Booking Confirmation
15. Admin Dashboard
16. Events Management
17. Schools Management
18. Coordinators Management
19. Drivers Management
20. Basic Reports

**Features**:
- Public website pages
- Eco-centre browsing and details
- School registration
- Basic single-activity booking
- Basic admin event management
- School, coordinator, and driver management
- Basic reporting

**Routes**:
- `/`
- `/about`
- `/eco-centres`
- `/eco-centres/:id`
- `/school/register`
- `/school/thank-you`
- `/contact`
- `/gallery`
- `/lecturers`
- `/execution-plan`
- `/bookings`
- `/bookings/:id`
- `/bookings/:ecoCentreId/:activityId`
- `/bookings/confirmation/:bookingId`
- `/admin`

---

#### **Stage 2: Advanced Booking** (Optional)
**Status**: ⚙️ Configurable (Can be enabled/disabled)

**Description**: Multi-activity bookings, full-day packages, and enhanced booking features

**Screens (11)**:
1. Multi-Activity Selection
2. Full-Day Package Booking
3. Time Slot Selection
4. Multi-Slot Booking
5. Enhanced Booking Form
6. Eco Centre Bookings Admin
7. Bookings Dashboard
8. All Bookings List
9. Eco Centres Management (Admin)
10. Activities Management (Admin)
11. Booking Reports

**Features**:
- Multi-activity booking selection
- Full-day package bookings
- Time slot management
- Multi-slot booking support
- Eco centre bookings admin module
- Activity and slot management
- Advanced booking reports

**Routes**:
- `/bookings/:id` (Enhanced with multi-activity)
- `/bookings/:ecoCentreId/:activityId` (Enhanced with full-day packages)
- `/admin?tab=bookings`

**Dependencies**: Requires Stage 1 (Foundation)

---

#### **Stage 3: Advanced Admin** (Optional)
**Status**: ⚙️ Configurable (Can be enabled/disabled)

**Description**: Complete admin features, advanced analytics, and comprehensive management

**Screens (10)**:
1. Advanced Reports Dashboard
2. Revenue Analytics
3. Booking Analytics
4. Eco Centre Analytics
5. Activity Performance Reports
6. Financial Reports
7. Advanced Filters and Search
8. Bulk Operations
9. Export Functionality
10. Advanced Settings

**Features**:
- Advanced analytics and reporting
- Revenue tracking and forecasting
- Performance metrics
- Bulk operations
- Advanced export options
- Comprehensive filtering
- System settings management

**Routes**:
- `/admin?tab=reports` (Enhanced reports)
- `/admin?tab=bookings` (Enhanced with advanced features)

**Dependencies**: Requires Stage 2 (Advanced Booking)

---

### Stage Management Admin Screen

**Location**: `/admin?tab=stages`

**Features**:
- View all 3 stages with their status (Enabled/Disabled)
- Enable/disable Stage 2 and Stage 3
- View detailed breakdown of screens, features, and routes for each stage
- See stage dependencies and warnings
- Real-time configuration updates
- Summary statistics (Total stages, Enabled, Disabled)

**Access Control**:
- Only administrators can access stage management
- Stage 1 cannot be disabled (always enabled)
- Stage 3 requires Stage 2 to be enabled

---

### How Stage Management Works

1. **Route Protection**: All routes are protected by `StageRouteGuard` component that checks if the route is enabled in any active stage
2. **Navigation Filtering**: Navigation links in `Navbar` automatically show/hide based on enabled stages
3. **Feature Flags**: Components can check stage availability using the `useStage` hook
4. **Configuration Storage**: Stage configuration is stored in `localStorage` for persistence
5. **Real-time Updates**: Changes to stage configuration take effect immediately across the application

---

### Stage Breakdown Summary

| Stage | Screens | Features | Routes | Status |
|-------|---------|----------|--------|--------|
| **Stage 1: Foundation** | 20 | 7 | 15 | Always Enabled |
| **Stage 2: Advanced Booking** | 11 | 7 | 3 | Configurable |
| **Stage 3: Advanced Admin** | 10 | 7 | 2 | Configurable |
| **Total** | **41** | **21** | **20** | - |

---

### Use Cases for Stage Management

1. **Gradual Rollout**: Enable features progressively as users become familiar with the system
2. **A/B Testing**: Test new features with a subset of users before full deployment
3. **Maintenance Mode**: Temporarily disable non-essential features during maintenance
4. **Feature Gating**: Control access to premium or advanced features
5. **Regional Deployment**: Enable different feature sets for different regions or user groups

---

### Technical Implementation

**Files**:
- `src/lib/stageConfig.ts` - Stage configuration and management functions
- `src/hooks/useStage.ts` - React hook for stage checking
- `src/components/StageRouteGuard.tsx` - Route protection component
- `src/pages/admin/StageManagement.tsx` - Admin UI for stage management

**Key Functions**:
- `getStageConfig()` - Get current stage configuration
- `updateStageEnabled()` - Enable/disable a stage
- `isRouteEnabled()` - Check if a route is available
- `isFeatureEnabled()` - Check if a feature is available
- `useStage()` - React hook for stage management

---
- Feedback & reviews system

---

## Technical Specifications

### Frontend Architecture
- **Component Structure**: Modular, reusable components
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Routing**: React Router DOM with protected routes
- **Styling**: Tailwind CSS with custom theme
- **Type Safety**: TypeScript throughout
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture (Future)
- **API Framework**: Node.js/Express or Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: AWS S3 or Cloudinary
- **API Documentation**: Swagger/OpenAPI

### Performance Optimization
- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Lazy loading, responsive images
- **Caching**: Browser caching, API response caching
- **Bundle Size**: Tree shaking, code minification

### Security Measures
- **Input Validation**: Server-side validation required
- **XSS Prevention**: React's built-in escaping
- **CSRF Protection**: Token-based protection
- **SQL Injection Prevention**: Parameterized queries (when backend implemented)
- **Secure File Uploads**: File type validation, size limits

---

## Maintenance & Support

### Regular Maintenance Tasks
- **Updates**: Dependency updates, security patches
- **Monitoring**: Error tracking, performance monitoring
- **Backups**: Daily database backups
- **Testing**: Regular testing of critical features

### Support Features
- **Error Handling**: Comprehensive error boundaries
- **Logging**: Application logging for debugging
- **User Support**: Contact form, help documentation

---

## Conclusion

The CEP platform is a comprehensive solution for managing eco-education programs. The current implementation includes all basic features and several add-on features. Future enhancements can be added incrementally based on requirements and budget.

The platform is designed to be scalable, maintainable, and user-friendly, with a focus on providing an excellent experience for schools, administrators, and end users.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Prepared By**: Development Team  
**Project**: CEP (CEP) - CEPLoveable

