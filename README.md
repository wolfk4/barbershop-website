<img width="1170" height="878" alt="KC logo" src="https://github.com/user-attachments/assets/f537c282-1732-46e5-aa78-5c453d9d0beb" />

# Kaizen Cutz Barbershop Website

A website built for Kaizen Cutz, a barbershop in Citrus Heights, CA. The site features individual barber profile pages, an online product shop, and online appointment booking so clients don't have to call.
Built with Next.js and Tailwind CSS, backed by a PostgreSQL database hosted on Neon.

## What this project is about
 
Most people looking for a haircut these days just open Booksy, which puts individual barbers in front of clients instead of the shops they work at. If you search "barbers in Sacramento" your top results are either Booksy listings or a barbershop website, so if your shop doesn't have a website you basically don't show up. The goal of this project was to fix that for Kaizen Cutz by giving them a real online presence, give each barber a page to show their work, and let clients book online.

## Routes

### `/`
**File:** `app/page.tsx`  
Main landing page of the website.

Possible use:
- Hero section
- Services overview
- Featured products
- Booking call to action
- Testimonials
  
<img width="2551" height="1263" alt="Screenshot 2026-05-12 161918" src="https://github.com/user-attachments/assets/382b8c60-f411-4aee-9aa7-1ae705d13110" />

---

### `/about-us`
**Folder:** `app/about-us`  
About page for the barbershop.

Possible content:
- Company story
- Team or barbers
- Mission and values
- Shop experience


---

### `/admin`
**Folder:** `app/admin`  
Admin section of the application.

Possible use:
- Manage products
- Manage bookings
- Manage users
- View dashboard metrics
- Update shop content

> This route should typically be protected with authentication and authorization.

---

### `/api`
**Folder:** `app/api`  
Server side API route handlers for the application.

Possible use:
- Product CRUD
- Booking submissions
- Contact form handling
- Authentication endpoints
- Admin actions

> Each subfolder inside `app/api` usually maps to its own API endpoint.

---

### `/contact`
**Folder:** `app/contact`  
Contact page for customer communication.

Possible content:
- Contact form
- Phone number
- Email
- Address
- Business hours
- Map embed

<img width="2553" height="1261" alt="Screenshot 2026-05-12 161745" src="https://github.com/user-attachments/assets/b82cca02-341e-44d8-92ab-c880416ff260" />


---

### `/shop`
**Folder:** `app/shop`  
Shop page for displaying products or grooming items.

Possible use:
- Product listing
- Product categories
- Shopping cart integration
- Checkout flow

<img width="2542" height="1247" alt="Screenshot 2026-05-12 161946" src="https://github.com/user-attachments/assets/23979983-3756-49f9-a8de-94851f7ca8d6" />


---

## Project Structure

```bash
app/
├── about-us/
├── admin/
├── api/
├── contact/
├── shop/
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx

components/
db/
lib/
public/
auth.ts
```

## Important Files

### `app/layout.tsx`

Defines the root layout for the application.

Typical responsibilities:

* Global HTML structure
* Navigation
* Footer
* Shared providers
* Metadata setup

### `app/globals.css`

Global styles for the entire app.

### `app/favicon.ico`

Site favicon.

### `components/`

Reusable UI components used across pages.

Examples:

* Navbar
* Footer
* Buttons
* Cards
* Product components
* Form components

### `db/`

Database related logic and configuration.
 
We're using Neon (PostgreSQL) and connecting through the `@neondatabase/serverless` package. The connection string lives in `.env.local` and never gets pushed to GitHub.
 
Tables we have so far:
- `barbers` — name, slug, bio, image, gallery, specialties
- `admins` — email, password hash, role

Still need to add: `products`, `orders`, `bookings`.

### ERD

<img width="1154" height="584" alt="ERD" src="https://github.com/user-attachments/assets/6eba23b4-f0e8-457c-9676-48f356590ea5" />


### `lib/`

Utility functions and shared helpers.

### `lib/utils.ts`

General helper utilities used across the project.

### `auth.ts`

Authentication related configuration or helper logic.

### `public/`

Static assets such as:

* Images
* Icons
* Logos
* Fonts

## Tech Stack

* **Next.js** with App Router
* **TypeScript**
* **CSS** via `Tailwind CSS`
* Auth.js for authentication
* PostgreSQL on Neon for the database

## Notes

* This project uses the **App Router** structure in Next.js.
* Each folder inside `app/` represents a route segment.
* Nested files inside those folders may create additional subroutes.
* The `app/api` directory is used for backend route handlers.

## Example Route Summary

| Route       | Purpose                                 |
| ----------- | --------------------------------------- |
| `/`         | Homepage                                |
| `/about-us` | About page                              |
| `/admin`    | Admin dashboard or protected admin area |
| `/contact`  | Contact page                            |
| `/shop`     | Product shop page                       |
| `/api/*`    | Backend API endpoints                   |

## Development

To run the project locally:

```bash
git clone https://github.com/wolfk4/barbershop-website.git
cd barbershop-website
npm install
```
 
Then make a `.env.local` file in the root with:
```
DATABASE_URL=your_neon_connection_string
AUTH_SECRET=your_auth_secret
```
 
Then:
```bash
npm run dev
```

Then open: http://localhost:3000

 
## Testing
 
TODO — we'll be doing this in CSC 191. The plan is unit tests for the helper functions in `lib/`, integration tests for the API routes, and end-to-end tests for the booking and admin flows.

## Deployment
 
TODO — also CSC 191. We're planning to deploy the frontend to Vercel and keep the database on Neon. Environment variables will be managed through Vercel.

## Timeline for 191

Based on the user stories in our JIRA, here's roughly what we want to get done next semester:

| Week | What |
|------|------|
| 2 | Scheduling plugin integrated into barber pages |
| 2 | Employee dashboard so barbers can upload their own bio, photo, and gallery |
| 4 | Admin login with hashed passwords and session handling |
| 4 | Admin dashboard for managing barbers |
| 6 | Shop page with product listings, cart, and checkout |
| 8 | Tests |
| 8 | Deploy to Vercel |
| 10 | Final touches |

## Future Improvements

- Add route level descriptions for nested routes
- Document API endpoints inside `app/api`
- Add authentication flow details
- Add database schema documentation
- Add deployment instructions
