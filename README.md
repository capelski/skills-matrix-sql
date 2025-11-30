# Skills Matrix SQL

Skills matrix application with a web frontend, a NestJS web API and a MySQL database.

## Setup

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [node.js](https://nodejs.org/en/download/current)
- Download [this repository](https://github.com/capelski/skills-matrix-sql.git) either by cloning it (if you have git installed) or via [zip file](https://github.com/capelski/skills-matrix-sql/archive/refs/heads/main.zip)

## Execution

- **Start**. Run the following command to start both the application. The `-d` flag runs the containers in detached mode (in the background).

```bash
docker-compose up -d
```

- **Stop**. Run the following command to stop the application. This stops and removes the containers but preserves the data in the MySQL volume.

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
