# Skills Matrix SQL

Skills matrix application with NestJS API and MySQL database.

## Services

This application consists of two main services:

- **API Service**: NestJS web API running on port 3000
- **MySQL Database**: MySQL 8.0 database running on port 3306

## Setup

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [node.js](https://nodejs.org/en/download/current)
- Install [git](https://git-scm.com/install/)
- Clone this repository
- Optional. Install the api project dependencies
    ```bash
    cd api
    npm ci
    ```

## Execution

* **Start**. Run the following command to start both the application. The `-d` flag runs the containers in detached mode (in the background).

```bash
docker-compose up -d
```

* **Stop**. Run the following command to stop the application. This stops and removes the containers but preserves the data in the MySQL volume.

```bash
docker-compose down
```

## Database Connection Details

Once the service is running, you can connect to MySQL using:

- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `skills_matrix`
- **Username**: `appuser`
- **Password**: `apppassword`