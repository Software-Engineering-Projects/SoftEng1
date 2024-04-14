# Ordering System

## Overview


## Key Features

- **Feature 1**: Register Feature
- **Feature 2**: Login Feature
- **Feature 3**: Email Verification Feature
- **Feature 4**: Dynamic User Navbar
- **Feature 5**: User Profile
- **Feature 6**: Signout Feature
- **Feature 7**: Admin Dashboard
- **Feature 8**: Search Feature
- **Feature 9**: Pagination Feature
- **Feature 10**: Dynamic Navbar


## Technologies Used

List of all the technologies, languages, frameworks, libraries etc. used in the project.

- **Language**: Javascript
- **Framework**: React.js, express.js
- **State Management**: Redux
- **Database**:  Firebase
- **Authentication**: Firebase Auth
- **UI**: Tailwind CSS, Shadcn UI, Flowbite, LucideReact, React Icons, Material UI
- **Email-Service**: Firebase Auth Email Service

# Getting Started

# Note the given installation videos has a few commands that do not work as expected make sure to follow the commands written here instead

## Prerequisites
Before you begin, make sure you have the following installed on your machine: 
### [Node.js Link](https://nodejs.org/en/download)

- Node.js

```
## Clone this repo
#### Note: You can put this into any directory you want

```

git clone https://github.com/Software-Engineering-Projects/SoftEng1.git
```

## Create a new Firebase project

## Create a new Webapp
### Setup .env file for frontend folder 

#### Upon registering your app you will be prompt with .env files for your firebase SDK
#### Copy those files into your .env file
#### Note your environment files will be different from mine so do not copy what is in the video

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN= 
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET= 
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID= 
VITE_BASE_URL=
```

## Create Service Account Key File
```
cd into backend/functions
Create new file serviceAccountKey.json

```

## Find your service account key 
```
Go to the firebase console 
Inside project settings
Service accounts tab
Generate new private key
Copy contents and paste into newly created serviceAccountKey.json
```

## Install Firebase Tools
```
cd to backend/functions
npm install -g firebase-tools 
npm i
```

## Setup backend development server

## Login to the firebase CLI
```
firebase login
```

## Run the backend server
```
npm run serve
```

## Setup frontend development server 
```
cd to frontend
npm install
npm run dev
```
#### Note: Occasionaly pull latest changes from main
```
git pull origin main
```
## NOTE: Make sure you install firebase in the backend/functions directory along with its dependencies
## Installation Video 

- **Video 1**: Installing and Setting Up

https://github.com/Software-Engineering-Projects/SoftEng1/assets/56209027/5625f287-93dc-436c-b15b-5fe714b7eff3

- **Video 2**: Starting the backend server

https://github.com/Software-Engineering-Projects/SoftEng1/assets/56209027/b4388e4c-f603-4d28-8260-9ed843ff87c4


- **Video 3**: Starting dev server


https://github.com/Software-Engineering-Projects/SoftEng1/assets/56209027/1d935b90-444f-4265-bbaa-1ab3822ef8f1


- **Video 4**: Creating firestore database
https://drive.google.com/file/d/1mJ6YsgKH8zmd2o5l8fDoM1vb18NmsDfr/view?usp=drive_link

- **Video 5**: Testing the API Endpoints
https://drive.google.com/file/d/1R4FPRYh7YzpeYxYRZ6e0Zzk0-Z0vSQXP/view?usp=drive_link


- **Video 6**: Setting Up Stripe(optional)
NOTE: Needed for testing checkout routes, order route as ordes will respond to certain events thrown by stripe webhook, (Check Stripe Docs regarding these webhook events)
https://drive.google.com/file/d/1tLhtRhPr38FAhrbuF0v66UBUnfRlXKFz/view?usp=drive_link

- **Video 7**: Setting Up Resend(for email verification)
https://drive.google.com/file/d/12DR-m0uIaIK_rlgJCTAgWoEIOkRNPMaq/view?usp=drive_link


