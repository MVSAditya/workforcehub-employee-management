# Deploy WorkforceHub on Render with Neon

This setup serves the Angular site and Spring Boot API from the same Render web
service. The database is a separate Neon PostgreSQL project, so data is not
stored on Render's temporary service filesystem.

## Create the free database

1. Create a free project at [Neon](https://console.neon.tech/).
2. Save the database name, username, password, and hostname shown in its
   connection details.
3. Build the JDBC URL in this format:
   `jdbc:postgresql://HOSTNAME/DATABASE?sslmode=require`

Neon's free plan currently has no fixed expiry date, but it is subject to
storage, compute, and usage limits and can change under Neon's terms. Keep an
independent backup of data you cannot afford to lose.

## Deploy to Render

1. Push this repository to GitHub, then create a new **Blueprint** in
   [Render](https://dashboard.render.com/), selecting this repository. Render
   will read `render.yaml` and build the Docker image.
2. In the Blueprint setup, provide the six prompted values:
   - `SPRING_DATASOURCE_URL`: the JDBC URL from the Neon instructions above
   - `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`: Neon
     credentials
   - `APP_ADMIN_USERNAME` and `APP_ADMIN_PASSWORD`: choose new, unique admin
     credentials; do not use the local development defaults
   - `SPRING_PROFILES_ACTIVE`: keep the configured value `postgres`
3. Finish creation and wait for the Render deploy to become live. Open the
   generated `https://workforcehub.onrender.com` URL (or the URL shown in the
   Render dashboard) on any device and sign in with the admin credentials.

The Render free web service may sleep when idle and take time to wake on the
next visit. Neon and Render enforce free-tier quotas and policies; this
configuration has no paid service selected, but neither provider guarantees
unlimited capacity or permanent availability on its free tier.

The application requires a server-side admin session for employee APIs. The
session cookie is HTTPS-only and same-site in the Render
PostgreSQL profile. Set or rotate the admin credentials in the Render service
environment and redeploy if needed.
