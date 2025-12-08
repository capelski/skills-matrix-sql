# Skills Matrix SQL

Skills matrix application with a React frontend, a NestJS web API and a MySQL database.

## Setup

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [node.js](https://nodejs.org/en/download/current)
- Download [this repository](https://github.com/capelski/skills-matrix-sql.git) either by cloning it (if you have git installed) or via [zip file](https://github.com/capelski/skills-matrix-sql/archive/refs/heads/main.zip)

## Execution

- **Start**. Run the `./start.sh` script to start the full application stack and access the web interface at http://localhost:3001

- **Stop**. Run the `./stop.sh` script to stop the application (it will preserve the data in the MySQL database).

## Instructions

Write the missing SQL commands in the `sql-commands.ts` file and the web application should start working.

## Architecture

- **Frontend**: React with TypeScript (port 3001)
- **API**: NestJS with mysql2 (port 3000)
- **Database**: MySQL 8.0 (port 3306)

## Database Connection Details

Once the service is running, you can connect to MySQL using:

- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `skills_matrix`
- **Username**: `appuser`
- **Password**: `apppassword`
