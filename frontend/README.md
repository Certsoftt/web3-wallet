Creating a simple browser-base form validation using react mui and react hook form

## Overview
1. Setting Up the React.js form app
2. Copy the following "Dynamic Fields folder" in the repo to the component folder
3. Copy App.tsx, Form.css, and logo.svg directly to the root level of your project folder

## Step 1: Setting Up the React.js form app
First, create a new project folder if you haven’t already:

bash
mkdir reactform
cd reactform
code .
npx create-react-app . --template typescript
Install react-hook-form @hookform/devtools @mui/material @mui/icons-material

bash
npm i express react-hook-form @mui/material @mui/icons-material -D @hookform/devtools


## Step 2: Copy the following "Dynamic Fields folder" in the repo to the component folder


## Step 3: Copy App.tsx, Form.css, and logo.svg directly to the root level of your project folder

## Final Project Structure
Your project directory should look like this:

reactform/src/component/MaterilaUI/Dynamic Fields/
├── DynamicInput.tsx          // form Component
├── Fallback.tsx             // Suspense fallback ui Component
├── Theme.Styles.ts         // Theme Style file
└── Theme.tsx              //  ThemeContext Component for Dark and light mode

outside the src/ folder we have

../src/
├── App.tsx          // App Component
├── Form.css        // form styling file
├── logo.svg       // favicon

## Run the Server
To run the server, use the following command:

bash
npm start
Navigate to http://localhost:3000 in your browser to access the form.

## Important Considerations
- Latency: Chuck data using lazy loading to improve performance.
- Dark mode: not working as desired.


This setup provides a simple form state submission and validation solution, where form state is captured and can be validated browser-based validation before posting to database for further validation at backend or server-side.







