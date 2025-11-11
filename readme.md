# Micro CRM Leads (Project 1)

## Live Deployment
Live: https://fullstack-p1-leads.onrender.com

## Run Locally

### Prerequisites
You must have Node.js (version 18 or later) installed.

### Setup Instructions
npm install // Installs all project dependencies defined in the package.json file.

npm start // Executes the "start" script defined in package.json (e.g., node server.js).

Open http://localhost:3000/ // Instructs the user where to access the application in their browser.

## API Endpoints
GET /api/leads # Retrieves a list of all leads. Optional query parameters: ?q= (search), &status= (filter by status)

POST /api/leads # Creates a new lead. Requires: name, email. Optional: company, source, notes.

PATCH /api/leads/:id # Updates an existing lead by ID. Fields to update: status, notes.

## Technology Stack
Node, Express, vanilla JS, JSON file storage.

## Features
- Create and list leads
- Filter by status and search by name or company
- Update status

## Windows and macOS Notes
Open VS Code terminal. The commands are the same on both platforms.

## Reflection (Required for Marking)
I have built an app that allows user to mark down leads. The technologies used in this project are: Node and Express for the back end and Javascript for the front end.

User adds Name and Email which are mandatory to the form. User can also add Company, Source and notes to the form. Then user presses the create button and the new lead can be seen on the below, on the Leads section of the page. On the Leads section of the page user can also search leads using name or company. If the user wants to change the status of the lead it is possible to do there also. 

I learned in this project a lot about full stack basics such as how to set up a HTTP server and how to do routing, how process data and how to make an UI for the app. Also I learnt about finding errors in the code and solving them. 

The improvements for the app could be the ability to delete leads on the UI. Also the appearance of the app could be a little more polished. 

<img width="745" height="417" alt="image" src="https://github.com/user-attachments/assets/07cc87df-1cce-47db-89b1-90603121adf0" />


Video timestamps:

00:00 Introduction and problem

00:20 Features and architecture

00:45 Live demo: add and edit item

02:30 Code highlight: load function

03:53 Reflection and next steps
