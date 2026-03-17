# Barbershop Website

A Next.js App Router project for a barbershop website with public pages, shop functionality, admin pages, and API routes.

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

---

### `/shop`
**Folder:** `app/shop`  
Shop page for displaying products or grooming items.

Possible use:
- Product listing
- Product categories
- Shopping cart integration
- Checkout flow

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
````

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

Possible contents:

* Database connection
* Schema definitions
* Queries
* ORM setup

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
* **CSS** via `globals.css`
* Possible authentication through `auth.ts`
* Possible database integration through `db/`

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
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Future Improvements

* Add route level descriptions for nested routes
* Document API endpoints inside `app/api`
* Add authentication flow details
* Add database schema documentation
* Add deployment instructions
