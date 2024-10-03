# Blog Creator

### A Modern Blog Creation Platform Built with Next.js

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.6-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue)
![Typescript](https://img.shields.io/badge/Typescript-5.x-blue)

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)

---

## Introduction

**Blog Creator** is a modern, feature-rich platform for creating and managing blogs with a sleek user interface. Built on Next.js, the application offers smooth user experiences, rich text editing with TinyMCE, cloud-based image and video uploads via Cloudinary, and secure authentication using NextAuth. It is designed to be scalable, secure, and easy to use, offering a seamless experience for bloggers and readers alike.

---

## Features

- **User Authentication**: Secure login/signup functionality with NextAuth.
- **Rich Text Editing**: Integrated TinyMCE editor for writing and formatting blog content.
- **Image and Video Uploads**: Cloudinary integration for seamless image and video handling.
- **Email Notifications**: Email verification using Nodemailer.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and MUI components and Shadcn components.
- **AI suggested headings**: Incorporated Cohere api to give headings based on the chosen topic for the blog.
- **Blog Recommendations**: Integrated Recombee to give blog recommendations based on the user preferences , actions (like,view actions) and according to topics most viewed. Utilizes content based filtering and collaborative filtering.
- **Milestones and Badges**: Developed a Badges system in which user gets different badges based on the milestones achieved and also tracks the upcoming milestones and progresses.

---

## Tech Stack

- **Next.js** (v14.2.6) full stack framework used for frontend and backend

### Frontend:
- **Tailwind CSS** (v3.4.1)
- **Typescript** (v5)
- **MUI Joy Components** (v5.0.0-beta.48)
- **Radix UI** (Dialog, Tooltip, Select, Toast)

### Backend:
- **NextAuth** for authentication
- **MongoDB** for data storage
- **Cloudinary** for image and video uploads
- **Nodemailer** for email verification
- **Cohere AI** for AI-based features
- **Recombee** for recommendation engine integration

---

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/chirag0785/BlogCreator.git
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```bash
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXT_PUBLIC_TINYMCE_API_KEY=
GMAIL_USER=
APP_PASSWORD=
COHERE_API_KEY=
GOOGLE_SECRET=
GOOGLE_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=
RECOMBEE_DEV_DATABASE_ID=
RECOMBEE_DEV_PRIVATE_TOKEN=
BASE_URL=
