# Nanang Eka Cahya Pernata - Portfolio

A professional, high-performance portfolio website built to showcase engineering experience, production-level projects, and technical skills. The application features a fully responsive design (with a highly curated "fast pitch" layout optimized for mobile recruiters) and a secured admin dashboard to manage content dynamically.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Custom CSS architecture
- **Animations:** Framer Motion
- **Database:** Firebase Firestore (for dynamic content management)
- **Authentication:** Firebase Auth (for Admin Dashboard)
- **Hosting:** Firebase Hosting

## Features

- **Dynamic Content Management:** Projects, experience, skills, and site copy are manageable via a built-in `/admin/dashboard`.
- **Mobile Optimized ("Fast Pitch"):** The mobile view strips away secondary content to quickly answer the most critical recruiter questions (Who are you? What role? What projects?) and presents clear Call-to-Actions (Download CV, Email me).
- **Secure Admin Panel:** Protected by Firebase Authentication to prevent unauthorized edits.
- **Robust SSR/Static Support:** Leveraging Next.js for excellent SEO and fast initial page loads.

## Local Setup

### 1. Clone the repository

```bash
git clone git@github.com:ekacahya21/My-Portfolio-App.git
cd My-Portfolio-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project. You will need to add your Firebase configuration credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ekacahya.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="ekacahya"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="ekacahya.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

*(Note: You can find these values in your Firebase Console > Project Settings > General).*

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The admin dashboard is accessible at `/admin/dashboard`.

## Deployment

This project uses the Next.js Web Frameworks integration with Firebase Hosting. This means Firebase handles the `next build` process automatically during deployment.

### Deploying to Firebase

1. **Login to Firebase CLI (if you haven't already)**
   ```bash
   npx firebase-tools login
   ```

2. **Deploy to production**
   ```bash
   npx firebase-tools deploy --project ekacahya
   ```

Upon completion, the site will be live at `https://ekacahya.web.app`.

### Domain Management
If you wish to map a custom domain (e.g., `nanangcahya.com`), you can configure this directly within the Firebase Console under **Hosting > Add Custom Domain**.
