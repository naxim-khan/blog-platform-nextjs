# **Inkforge — Modern Blog Creation & Management Platform**

A full-stack blogging platform built with **Next.js 16**, **MongoDB**, **JWT Authentication**, **Tailwind CSS**, and **shadcn/ui**. Users can write, edit, publish, and manage their blogs using a clean dashboard, while visitors can read posts publicly with a fast modern UI.

Inkforge includes SEO-friendly slugs, secure authentication, password reset via Gmail, profile management, a TipTap editor, and protected API routes — all built with real-world production standards.

---

##  **Tech Badges**

---

# **Features**

###  Authentication & Security

* JWT authentication with `jose`
* Zod validation for backend input safety
* Password hashing with bcryptjs
* Full forgot-password flow using **Nodemailer (Gmail App Password)**
* Reset token expires in 1 hour
* Protected dashboard routes (middleware)

### Blog System

* Create, edit, publish, delete posts
* TipTap rich text editor with images, headings, code blocks, links, formatting
* SEO-friendly slugs
* Views counter
* Featured image (URL-based)
* Categories & tags support

### Public Website

* Homepage `/` shows all published posts
* SEO metadata (OG + Twitter embeds)
* Public blog detail `/blog/:slug`
* Public user-profile `/user/:id` with their posts

### Dashboard

* `/dashboard` with user stats (Recharts)
* `/dashboard/posts` for listing posts
* `/dashboard/create` to create posts
* `/dashboard/edit/:id` to edit posts
* Profile page: update username, email, password, profile image

### UI/UX

* shadcn/ui components
* Radix UI primitives
* Responsive grid
* Tailwind CSS with modern animations
* Beautiful typography

---

# **Project Structure**

```
my-blog-app/
│
├── app/
│   ├── (public)/
│   │   ├── blog/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   └── user/[id]/page.jsx
│   │
│   ├── auth/
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   ├── reset-password/page.jsx
│   │
│   ├── dashboard/
│   │   ├── page.jsx
│   │   ├── posts/page.jsx
│   │   ├── create/page.jsx
│   │   └── edit/[id]/page.jsx
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.js
│       │   ├── register/route.js
│       │   ├── forgot/route.js
│       │   └── reset/route.js
│       ├── posts/
│       │   ├── route.js
│       │   └── [id]/route.js
│       └── users/[id]/route.js
│
├── components/
│   ├── ui/
│   ├── editor/
│   └── layout components
│
├── lib/
│   ├── db.js
│   ├── jwt.js
│   ├── mail.js
│   └── validators/
│       ├── auth.js
│       ├── post.js
│       └── reset.js
│
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Token.js
│
└── utils/
    ├── sanitize.js
    └── date.js
```

---

# **Installation & Setup**

### 1. Clone Repository

```bash
git clone https://github.com/yourname/inkforge.git
cd inkforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

---

# **API Overview**

### Auth

| Route                | Method | Description       |
| -------------------- | ------ | ----------------- |
| `/api/auth/register` | POST   | Register new user |
| `/api/auth/login`    | POST   | Login user        |
| `/api/auth/forgot`   | POST   | Send reset email  |
| `/api/auth/reset`    | POST   | Reset password    |

### Posts

| Route            | Method | Description             |
| ---------------- | ------ | ----------------------- |
| `/api/posts`     | GET    | Get all published posts |
| `/api/posts`     | POST   | Create post             |
| `/api/posts/:id` | PUT    | Update post             |
| `/api/posts/:id` | DELETE | Delete post             |
| `/blog/:slug`    | GET    | Get post by slug        |

### Users

| Route            | Method | Description              |
| ---------------- | ------ | ------------------------ |
| `/api/users/:id` | GET    | Get user profile + posts |

---

# **Authentication Flow**

1. User logs in
2. Server signs JWT using `jose`
3. Token stored in HTTP-only cookie
4. Middleware validates token for private routes
5. Logout removes token cookie

---

# **Screenshots**


![Home Page]
<img src="./screenshots/home.png" alt="Home Page" width="100%" />
![Blog Page](./screenshots/blog.png)
![Dashboard](./screenshots/dashboard.png)
![Create Post](./screenshots/create.png)
![Profile](./screenshots/profile.png)


---

# **Contact**

**Developer:** Nazeem Khan
**GitHub:** [https://github.com/naxim-khan](https://github.com/naxim-khan)
**Portfolio:** [https://nazeem-khan-portfolio.vercel.app](https://nazeem-khan-portfolio.vercel.app)