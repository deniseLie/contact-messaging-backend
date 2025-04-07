
## Setup Instructions

1. **Node.js** (version 14.x or higher)  
   You can download Node.js from [here](https://nodejs.org/).
   
2. **npm** (Node Package Manager)  
   npm is bundled with Node.js, so once you install Node.js, npm will also be available.

### Steps to Run the Project Locally

1. **Clone the Repository**  
   Start by cloning the repository to your local machine:
   ```bash
   git clone https://github.com/deniseLie/contact-messaging-backend 
   cd https://github.com/deniseLie/contact-messaging-backend 
   ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Setup local postgres**
    1. Create a table called contact-msg-db

    2. Add your own .env file with `
    `DATABASE_URL='postgres://postgres:password@localhost:5432/contact-msg-db'`

3. **Fill up database**
    ```bash
    node ./seed/seed.js
    ```

3. **Run Server**
    ```bash
    node server.js
    ```

## System Requirements
1. Node.js >= 16
2. PostgreSQL >= 13

## Assumptions
1. Every message belongs to exactly one sender and one receiver from contacts

## Key Design Decisions
1. GIN indexes are used for full-text search on content and name for performance
2. Phone numbers use a B-tree index for exact lookups