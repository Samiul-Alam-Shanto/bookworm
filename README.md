<div align="center">

  <h1>📚 BookWorm</h1>
  
  <p>
    <strong>A Premium Personalized Book Recommendation & Reading Tracker</strong>
  </p>

  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://www.mongodb.com">
      <img src="https://img.shields.io/badge/MongoDB-Native-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    </a>
    <a href="https://next-auth.js.org">
      <img src="https://img.shields.io/badge/Auth-NextAuth_v4-purple?style=for-the-badge&logo=jsonwebtokens" alt="NextAuth" />
    </a>
  </p>
  <p>
  <a href="https://bookworm-sooty.vercel.app"><strong>Live Site<strong/></a>
  </p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>

</div>

<hr />

## 📖 About The Project

**BookWorm** is a sophisticated reading tracking application designed to make book discovery engaging and personalized. It moves beyond simple lists, offering a "Cozy Library" experience with intelligent recommendations, community interactions, and detailed reading statistics.

Built with performance and scalability in mind, it leverages the latest **Next.js App Router** and **Server-Side Rendering** patterns.

## ✨ Key Features

### 👤 User Experience

- **📚 Smart Library:** Manage books across _Want to Read_, _Currently Reading_, and _Read_ shelves.
- **🧠 AI-Like Recommendations:** Logic-based suggestion engine analyzing your reading history and favorite genres.
- **📊 Reading Stats:** Visual breakdowns of your annual goals, monthly activity, and genre distribution using interactive charts.
- **🔥 Streak Tracking:** Gamified daily reading streaks to keep you motivated.
- **🌍 Social Feed:** Follow other users and see their reviews and shelving activity in real-time.

### 🛡️ Admin Command Center

- **📈 Real-time Analytics:** Dashboard tracking new users, review velocity, and content growth.
- **🛠️ Content Management:** Full CRUD capabilities for Books, Genres, and Tutorials.
- **⚖️ Moderation:** Review approval system to ensure community safety.
- **👥 User Management:** Role-based access control (RBAC) to promote/demote users.

### 🎨 Premium UI/UX

- **Possible Themes:** Seamless Light/Dark mode toggle.
- **Animations:** Smooth transitions using Framer Motion.
- **Responsive:** Fully mobile-optimized layout with sidebar/bottom navigation.
- **Skeletons:** Loading states for a perceived instant-load experience.

## 🛠️ Tech Stack

| Domain               | Technologies                            |
| :------------------- | :-------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                 |
| **Language**         | JavaScript (ES6+)                       |
| **Styling**          | Tailwind CSS v4, Lucide React (Icons)   |
| **Database**         | MongoDB (Native Driver for Performance) |
| **Authentication**   | NextAuth.js v4 (Credentials Provider)   |
| **State Management** | TanStack Query (React Query)            |
| **Visualization**    | Recharts (Data Charts)                  |
| **Forms**            | React Hook Form                         |
| **Notifications**    | React Hot Toast, SweetAlert2            |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas Account
- ImgBB API Key (for image uploads)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Samiul-Alam-Shanto/bookworm.git
    cd bookworm
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    # Database Connection
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bookworm

    # NextAuth Configuration
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_random_string

    # Third Party Services
    NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

    # API Url
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Designed & Build with ❤️ by Samiul Alam Shanto
