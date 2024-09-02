# Online Learning Platform with Aptos NFT Integration

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup](#setup)
5. [Usage](#usage)
6. [NFT Minting](#nft-minting)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Contributing](#contributing)
10. [License](#license)

## Introduction
This project is an online learning platform that allows users to enroll in courses, track their progress, and earn NFTs upon course completion. The platform is built with Next.js and integrates with the Aptos blockchain for NFT minting.

## Features
- User authentication and authorization
- Course listing and enrollment
- Progress tracking for enrolled courses
- Chapter-based course structure
- NFT minting upon course completion (Aptos blockchain)
- User dashboard for course and NFT management

## Tech Stack
- Frontend: Next.js, React
- Backend: Node.js, Express
- Database: PostgreSQL with Prisma ORM
- Authentication: Clerk
- Blockchain: Aptos
- Smart Contract: Move language
- Styling: Tailwind CSS

## Setup
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
 
   ```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```

5. Deploy the Aptos smart contract:
   Follow the Aptos documentation to deploy the `CourseCompletionNFT` contract.

6. Start the development server:
   ```
   npm run dev
   ```

## Usage
1. Register/Login: Users can sign up or log in using Clerk authentication.
2. Browse Courses: View available courses on the homepage.
3. Enroll: Users can enroll in courses for free.
4. Learn: Access course content and track progress through chapters.
5. Complete: After finishing all chapters, mark the course as complete.
6. Mint NFT: Users can mint an NFT as proof of course completion.

## NFT Minting
Upon course completion, users can mint an NFT on the Aptos blockchain. The process is as follows:
1. User completes all chapters of a course.
2. The "Mint NFT" button becomes available on the course completion page.
3. User clicks the button to initiate the minting process.
4. The backend verifies course completion and interacts with the Aptos blockchain.
5. An NFT is minted and transferred to the user's Aptos wallet.
6. The UI updates to show the minted NFT and provides a link to view it on Aptos Explorer.

## API Endpoints
- `POST /api/courses/:courseId/enroll`: Enroll in a course
- `GET /api/courses/:courseId`: Get course details
- `POST /api/courses/:courseId/progress`: Update course progress
- `POST /api/courses/:courseId/complete`: Mark a course as complete
- `POST /api/courses/:courseId/mint-nft`: Mint NFT for completed course

## Database Schema
```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  aptosAddress  String?
  enrollments   Enrollment[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String?
  chapters    Chapter[]
  enrollments Enrollment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Chapter {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  content     String
  order       Int
  course      Course   @relation(fields: [courseId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Enrollment {
  id           String   @id @default(cuid())
  userId       String
  courseId     String
  progress     Int      @default(0)
  isCompleted  Boolean  @default(false)
  user         User     @relation(fields: [userId], references: [id])
  course       Course   @relation(fields: [courseId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, courseId])
}
```

## Contributing
We welcome contributions to this project. Please follow these steps:
1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.