# 📚 Streak Hub Application Documentation

## 1\. 🎯 Overview

**Streak Hub** is a full-stack, personal discipline tracker designed to help users manage multiple "streaks" or habit goals (e.g., No PMO, Gym, Reading). It leverages a modern, efficient, and type-safe technology stack.

### Key Features

  * **Multiple Goal Tracking:** Users can create, view, and track an unlimited number of custom streaks.
  * **Current/Max Streak Tracking:** Calculates the current streak length and persistently tracks the highest-ever record.
  * **Server Actions:** Utilizes Next.js Server Actions for secure, efficient data mutations.
  * **PostgreSQL Persistence:** Uses a robust relational database for reliable data storage.

### Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 14+ (App Router) | Full-stack React framework. |
| **Database** | PostgreSQL | Latest | Primary data storage. |
| **ORM** | Prisma | Latest | Database access, schema definition, and migration. |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS for rapid UI development. |
| **Data Flow** | Server Actions | Next.js Feature | Backend logic and data persistence. |

-----

## 2\. ⚙️ Setup and Installation

Follow these steps to set up the Streak Hub application locally.

### 2.1. Prerequisites

You must have the following installed:

  * Node.js (LTS version)
  * npm or yarn
  * PostgreSQL Database instance

### 2.2. Project Initialization

1.  **Clone the Repository (Conceptual):**
    ```bash
    git clone [your-repo-url]
    cd streak-hub
    ```
2.  **Install Dependencies:**
    ```bash
    npm install @prisma/client prisma pg
    # And your standard Next.js dependencies (react, react-dom, next, tailwind)
    ```

### 2.3. Database Configuration

1.  **Environment Variables:** Create a file named `.env` in the root of the project and add your PostgreSQL connection string:
    ```env
    # .env
    DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database_name]?schema=public"
    ```
2.  **Run Migrations:** Use Prisma to push the schema and create the tables in your database.
    ```bash
    npx prisma migrate dev --name init_multiple_streaks
    ```
3.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

### 2.4. Initial Seed (Optional)

To ensure the application runs correctly, you must have at least one `User` record (with `id=1`) and optionally an initial `Streak` record.

**Manual Seed (If not using a Prisma seed script):**
Connect to your database and insert a conceptual user record:

```sql
INSERT INTO "User" (id, email, name) VALUES (1, 'demo@streakhub.com', 'Demo User') ON CONFLICT (id) DO NOTHING;
```

### 2.5. Start the Application

```bash
npm run dev
```

The application will now be running at `http://localhost:3000`.

-----

## 3\. 🐘 Data Model (Prisma Schema)

The core data is managed by two models: `User` and `Streak`.

### `prisma/schema.prisma`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  streaks   Streak[] // 1 User to Many Streaks
}

model Streak {
  id              Int      @id @default(autoincrement())
  userId          Int      
  name            String   
  startDate       DateTime @map("start_date") // The day the streak began
  maxStreakDays   Int      @map("max_streak_days") @default(0) // Highest record
  lastUpdated     DateTime @map("last_updated") @default(now())
  
  // Relationships
  user            User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, name]) // Ensures a user can't have two streaks with the same name
  @@map("streaks")
}
```

-----

## 4\. 🚀 Server Actions (`app/actions.js`)

All database interactions are handled via these server actions, ensuring logic runs securely on the server.

| Action | Purpose | Input | Output |
| :--- | :--- | :--- | :--- |
| `getAllStreaks()` | Fetches and calculates the current streak for all goals belonging to the user (`USER_ID = 1`). | None | Array of Streak objects (`{ id, name, currentStreak, maxStreak, startDate }`). |
| `createStreak(name)` | Creates a new `Streak` record, setting the initial `startDate` to today and `maxStreakDays` to 0. | `name` (String) | `{ success: boolean, error?: string }` |
| `resetStreak(streakId)` | Resets a specific streak by updating its `startDate` to today. Updates the `maxStreakDays` record if the current streak was a new high. | `streakId` (Int) | `{ success: boolean, error?: string }` |

### Core Logic: `calculateStreak`

The streak calculation logic is housed within the actions layer to ensure consistency:

```javascript
function calculateStreak(startDate) {
  // Logic calculates the number of full days passed since startDate,
  // normalizing to UTC midnight for accurate day-to-day comparison.
}
```

-----

## 5\. ⚛️ Frontend Components

The frontend is a Client Component tree designed for reactivity and visual feedback.

### `app/page.js` (Home Screen)

  * **Role:** The root component that manages the application state (list of streaks).
  * **Data Flow:** Uses `useEffect` to call `getAllStreaks()` on load. The component passes the data and a refresh function (`loadStreaks`) down to its children.
  * **Children:** Renders the `<NewStreakForm />` and a list of `<StreakCard />` components.

### `components/NewStreakForm.js` (Needs Implementation)

  * **Role:** Handles user input for creating a new streak.
  * **Integration:** Uses `useFormStatus` and calls the `createStreak` server action on submission. On success, it calls the `loadStreaks` function passed from `app/page.js` to refresh the list.

### `components/StreakCard.js` (Implemented)

  * **Role:** Displays the name, current days, record, and start date for a single streak.
  * **Integration:** Contains the `<ResetButton />`, which calls the `resetStreak` server action. A confirmation dialog prevents accidental resets.

### 