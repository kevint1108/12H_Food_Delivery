# 🍔 12H Food Delivery

# 🍔 12H Food Delivery

A full-stack food delivery web app built with the **MERN stack** — customer ordering site, admin dashboard, JWT auth, Stripe checkout, and Cloudinary-hosted images. Deployed on **Vercel** as three independent projects from a single repo.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

---

## ✨ Features

**Customer site**
- Browse menu by category, search dishes by name/description
- Cart with live quantity updates and totals
- Sign up / log in (JWT)
- Secure checkout via Stripe Checkout
- Order history with live delivery status

**Admin panel**
- Add new dishes with image upload (stored on Cloudinary)
- View, list, and remove menu items
- View all orders and update delivery status

---

## 📸 Screenshots

### Customer site

| Home | Menu |
|:---:|:---:|
| ![Home page](screenshots/Frontend_of_12H.png) | ![Menu grid](screenshots/Favorite_dished.png) |

| Search | Search results |
|:---:|:---:|
| ![Search bar](screenshots/search_button_in_12h.png) | ![Search results](screenshots/Search_Result_in_12h.png) |

| Cart | Delivery info |
|:---:|:---:|
| ![Cart](screenshots/In_cart_12h.png) | ![Checkout delivery info](screenshots/checkout-delivery.png) |

| Stripe checkout | Order history |
|:---:|:---:|
| ![Stripe payment](screenshots/Stripe_payment_in_12h.png) | ![My Orders](screenshots/My_orders_in_12h.png) |

<details>
<summary>Mobile app / footer</summary>

![Footer](screenshots/mobile_app_icon_12h.png)

</details>

### Admin panel

| Add item | Manage items |
|:---:|:---:|
| ![Admin add item](screenshots/admin-add-item.png) | ![Admin item list](screenshots/admin-list-items.png) |

| Manage orders |
|:---:|
| ![Admin orders](screenshots/admin-orders.png) |

---

## 🛠️ Tech stack

| Layer | Stack |
|---|---|
| Customer site | React 19 + Vite |
| Admin panel | React 19 + Vite |
| Backend API | Node.js + Express 5 (deployed as a Vercel serverless function) |
| Database | MongoDB Atlas + Mongoose |
| Image storage | Cloudinary |
| Payments | Stripe Checkout |
| Auth | JWT |
| Hosting | Vercel — 3 separate projects from this repo |

---

## 📁 Project structure

```
12H_Food_Delivery/
├── Backend/     # Express API — auth, food, cart, orders, Stripe, Cloudinary
├── Frontend/    # Customer-facing React app
└── admin/       # Admin dashboard React app
```

Each folder is deployed as its own Vercel project, pointed at this repo with a different **Root Directory**.

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is fine)
- A [Cloudinary](https://cloudinary.com) account
- A [Stripe](https://stripe.com) account (test mode is fine for development)

### Install

```bash
git clone https://github.com/kevint1108/12H_Food_Delivery.git
cd 12H_Food_Delivery

cd Backend && npm install
cd ../Frontend && npm install
cd ../admin && npm install
```

### Environment variables

**`Backend/.env`**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `FRONTEND_URL` | Deployed customer site URL (used for Stripe redirect) |
| `ADMIN_URL` | Deployed admin panel URL |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary Dashboard |

**`Frontend/.env`** and **`admin/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (`http://localhost:4000` for local dev) |

### Run locally

```bash
# Terminal 1
cd Backend && npm run server

# Terminal 2
cd Frontend && npm run dev

# Terminal 3
cd admin && npm run dev
```

---

## 🔌 API overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/user/register` | Create account |
| `POST` | `/api/user/login` | Log in, returns JWT |
| `GET` | `/api/food/list` | List all food items |
| `POST` | `/api/food/add` | Add food item (multipart, admin) |
| `POST` | `/api/food/remove` | Remove food item (admin) |
| `POST` | `/api/cart/add` / `/api/cart/remove` / `/api/cart/get` | Manage cart (auth required) |
| `POST` | `/api/order/place` | Create order + Stripe Checkout session |
| `POST` | `/api/order/verify` | Confirm payment after Stripe redirect |
| `POST` | `/api/order/userorders` | Get logged-in user's orders |
| `GET` | `/api/order/list` | List all orders (admin) |
| `POST` | `/api/order/status` | Update order status (admin) |

---

## ☁️ Deployment

Deployed on Vercel as three separate projects from this repository, each with its own Root Directory (`Backend`, `Frontend`, `admin`) and environment variables.

---

## 🙏 Acknowledgments

- Built on top of the [GreatStack Food Delivery tutorial](https://www.youtube.com/watch?v=DBMPXJJfQEA)
- Vercel deployment approach adapted from [Codinzero's MERN deploy guide](https://www.youtube.com/watch?v=22Rywce_kcg)
