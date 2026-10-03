# Backend database setup

The default Spring profile uses the existing file-based H2 database. To use MySQL, start a MySQL Server reachable from the machine running this backend, then activate the `mysql` profile. MySQL Workbench is a client; the backend connects to the MySQL Server instance that Workbench uses.

The MySQL profile defaults to a separate `workforcehub` database and the `root` username. It creates the database if needed and lets Hibernate create or update the application tables. The existing `emp` database is not modified. Set the password locally rather than storing it in this repository:

```sh
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=workforcehub
export MYSQL_USERNAME=root
export MYSQL_PASSWORD='your-local-mysql-password'
SPRING_PROFILES_ACTIVE=mysql ./mvnw spring-boot:run
```

For the `root` / `root` credentials supplied for your local MySQL server, set `MYSQL_PASSWORD=root` in your local shell environment. Do not commit that value.

If this project is running in Codespaces while MySQL Server is on your PC, `localhost` refers to the Codespace, not your PC. To use the PC's database, run the backend on your PC or provide a network-accessible MySQL host and set `MYSQL_HOST` accordingly.