# Project Name
This repo contains code for webapp as a part of csye6225

 

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Git 2.x or higher
- NPM 8.x or higher
- NodeJs 16.x or higher.

 

## Getting Started
These instructions will help you set up and deploy the web application locally.

 

### Installation
- Clone the organization repo using: git clone git@github.com:csye6225-sumeet-deshpande/webapp.git
- Install NodeJs dependencies: npm i
- Create a .env file and add the following variables PGHOST, PGPORT, PGUSER, PGPASSWORD,CSVPATH
- Start the server: node index.js

 

### Application contains the following endpoints
- GET /healthz - To check the health of the webapp
- POST /v1/assignments - To create a new assignment
- GET /v1/assignments - To receive all assignments information
- GET /v1/assignments/:id - To receive assignment information
- PUT /v1/assignments/:id - To update assignment information
- DELETE /v1/assignments/:id - To delete assignment information