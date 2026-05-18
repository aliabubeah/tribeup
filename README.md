# TribeUp

Live Demo: https://tribeupp.netlify.app/

TribeUp is a social community app built with React and Vite. It includes features like authentication, messaging, tribes/groups, notifications, profile management, and a dynamic feed. The project is still in progress and under active development.

## 🧰 Tech Stack Used

- **Framework:** React 19
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Data Fetching:** React Query
- **Real-time Communication:** @microsoft/signalr
- **UI:** Tailwind CSS, Headless UI, Swiper
- **Notifications:** React Hot Toast
- **Authentication:** JWT decoding with jwt-decode
- **Linting / Formatting:** ESLint, Prettier

## 🚀 How to Start

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the development server:
    ```bash
    npm run dev
    ```
3. Open the app in your browser at:
    ```bash
    http://localhost:5173
    ```

## 📁 Project Structure

- `src/`: main source folder
- `src/features/`: feature modules including auth, messaging, profile, tribes, notifications, and more
- `src/ui/`: reusable UI components and layout elements
- `src/services/`: API and backend communication layers
- `src/utils/`: helper utilities
- `src/store/`: Redux store configuration
