FROM node:18-bookworm-slim AS frontend-build
WORKDIR /frontend
COPY ["employee frontend final/package.json", "employee frontend final/package-lock.json", "./"]
RUN npm ci
COPY ["employee frontend final/", "./"]
RUN npm run build -- --configuration production

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY emp_backend/pom.xml ./
COPY emp_backend/src ./src
COPY --from=frontend-build /frontend/dist/frontend/ ./src/main/resources/static/
RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /backend/target/emp_backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
