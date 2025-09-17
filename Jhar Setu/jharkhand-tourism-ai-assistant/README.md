# Jharkhand Tourism AI Assistant

This is a local version of the AI-powered digital tourism platform for Jharkhand, built with React, TypeScript, Vite, and the Google Gemini API.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Clone or Download the Project

Download the project files into a directory of your choice.

### 2. Create an Environment File

The application requires API keys to function.

- Find the file named `.env.example` in the root of the project.
- Duplicate this file and rename the copy to `.env`.
- Open the new `.env` file and add your API keys:

```
# .env file

# Get your Gemini API key from Google AI Studio: https://aistudio.google.com/app/apikey
VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# (Optional) Get your Google Maps API key from Google Cloud Console: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
```

**Important**: The `VITE_` prefix is required for Vite to expose these variables to your frontend code.

### 3. Install Dependencies

Open your terminal, navigate to the project's root directory, and run the following command to install all the necessary packages from `package.json`:

```bash
npm install
```

This will create a `node_modules` directory with all the required libraries.

## Running the Development Server

Once the installation is complete, you can start the local development server:

```bash
npm run dev
```

This command will start the Vite development server. It will print a local URL in your terminal (usually `http://localhost:5173/`). Open this URL in your web browser to see the application running.

The server supports Hot Module Replacement (HMR), so any changes you make to the source code will be reflected in the browser instantly without a full page reload.

## Building for Production

When you are ready to deploy your application, you can create an optimized production build:

```bash
npm run build
```

This will compile the application and bundle all files into a `dist` folder in the project root. You can then deploy the contents of this `dist` folder to any static hosting service.
