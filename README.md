# Taste It API: Backend Repository 

This repository contains the backend code for the Taste It mobile application, an event management app designed for users to create, manage, and share tasting events. It's built on a robust tech stack, including Express.js, Prisma, and Postgres SQL.

## Table of Contents
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Frontend Repository](#frontend-repository)

## Getting Started

In this repository, you'll find the server-side logic of the Taste It mobile application. To get it running locally on your system, follow the installation instructions in the next section.

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/michaelito80us/taste-it-api.git
```

2. **Create a .env file and add the following keys:**
```bash
DATABASE_URL=<your_postgres_database_link>
```
**Note:** The database link can be a local link or a link to an online database like Supabase.

3. **Install all dependencies:**
```bash
npm i
```

4. **Set up the database schema:**
```bash
prisma generate
```

5. **Start the server:**
```bash
npm start
```

**Note:** Ensure you replace `<your_postgres_database_link>` with your actual database link.

## Features

1. **Authentication**: A custom-made authentication mechanism built on cookies and bcrypt secures user data and personalizes experiences.

2. **Event Management**: Handles requests related to event creation, editing, and deletion, as well as RSVP management.

3. **Database Management**: Utilizes Prisma ORM for efficient, structured data handling and operations in the PostgreSQL database.

## Tech Stack
- Express.js
- Prisma ORM
- PostgreSQL
- Custom Authentication with cookies and bcrypt

## Frontend Repository

The frontend of this application is located in a separate GitHub repository at [this link](https://github.com/your-username/taste-it-front).

