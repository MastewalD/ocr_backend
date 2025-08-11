# Receipt OCR & Management API

A GraphQL API server that allows users to upload receipt images, automatically extract key receipt data using OCR (Optical Character Recognition), categorize receipts, and store the structured receipt data in a database for easy retrieval and management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)

---

## Project Overview

This project delivers a full featured backend API that enables users to register, authenticate, and manage their receipts through a secure GraphQL interface. Users can upload images of receipts, which are processed using Tesseract.js OCR to accurately extract textual data. The system parses key receipt details including store name, purchase date, total amount, and individual purchased items then categorizes and persists this structured data in a relational database.

The API supports efficient, paginated retrieval of all receipts belonging to a user, as well as fetching detailed information for any specific receipt. File uploads are rigorously validated for type and size to ensure robustness. This solution is designed for scalability, ease of integration, and reliable receipt data management.

---

## Features

- User authentication and authorization
- Image upload via GraphQL mutation
- File type and size validation
- OCR processing on receipt images to extract text
- Automatic categorization of receipts
- Stores receipt data and items in a relational database
- Paginated querying of receipts with filtering by category
- Fetch detailed receipt by ID
- Error handling with descriptive messages

---

## How It Works

1. **User Uploads Image**: User uploads a receipt image file through the `uploadReceipt` GraphQL mutation. The server validates the file type and size.

2. **Image Storage**: The image is temporarily saved to a server directory and removed after processed.

3. **OCR Processing**: The server runs OCR on the stored image to extract text content.

4. **Data Extraction & Categorization**: Key receipt details (store name, date of purchase, total amount, purchased items) are parsed from the OCR text. The receipt is categorized based on content keywords.

5. **Database Save**: The extracted receipt data, including individual purchased items, are saved to the database linked with the authenticated user.

6. **Response**: The server returns the structured receipt data back to the user.

7. **Querying**: Users can query paginated receipts or fetch a specific receipt by ID.

---

## Tech Stack

- **Node.js** with **Apollo Server Express** for GraphQL API
- **Prisma ORM** with PostgreSQL or Neon for database
- **graphql-upload** for handling file uploads
- **Tesseract.js / Custom OCR Service** for Optical Character Recognition
- **Bcryptjs** for hash user password
- **jsonwebtoken** to generate token
- Custom utilities for file validation, date conversion, and receipt categorization

---

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- `npm` or your preferred package manager
---
### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MastewalD/ocr_backend.git
    cd ocr_backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
   

   ```bash
    DATABASE_URL='postgresql://neondb_owner:npg_lYa9T6zwCZJc@ep-curly-snow-adag0enc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    JWT_SECRET="test"
    JWT_EXP=10d
    PORT=5000
   ```





4.  ** Set up the database:**

       ```bash
        npm run migrate:generate
         npm run migrate:deploy
       ```



5.  **Run the development server:**
    ```bash
    npm run dev
    ```
---
## Available Scripts

- `npm run dev`: Starts the development server in watch mode for local development.
- `npm run start`: Starts the production server (requires a build to be generated first).
- `npm run migrate:generate`: Generates a new database migration file based on schema changes.
- `npm run migrate:deploy`: Applies pending migrations to the database.
