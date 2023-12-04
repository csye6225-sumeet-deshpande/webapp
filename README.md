# Project Name
This repo contains code for webapp as a part of csye6225

 Demo for review asg 6 changes

## Prerequisites
Before you begin, ensure you have met the following requirement:
- Git 2.x or higher
- NPM 8.x or higher
- NodeJs 16.x or higher

demo  

## Getting Started
These instruction will help you set up and deploy the web applications

 

### Installation
- Clone the organization repo using: git clone git@github.com:csye6225-sumeet-deshpande/webapp.git
- Install NodeJs dependencies: npm i
- Create a .env file and add the following variables PGHOST, PGPORT, PGUSER, PGPASSWORD,CSVPATH
- Start the server: node index.js

 

### Application contains the following endpoint
- GET /healthz - To check the health of the webapps
- POST /v2/assignments - To create a new assignments
- GET /v2/assignments - To receive all assignments information
- GET /v2/assignments/:id - To receive assignment information
- PUT /v2/assignments/:id - To update assignment information
- DELETE /v2/assignments/:id - To delete assignment information

### Added Script 

- aws acm import-certificate --certificate file://Certificate.pem --certificate-chain file://CertificateChain.pem --private-key file://PrivateKey.pem --profile demo
