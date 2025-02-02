# OSC API

A GraphQL API service built with Apollo Server, TypeScript, and PostgreSQL. This API provides endpoints for managing courses, collections, and user authentication.

## View A Quick Demo

You can view a live demo of the API by using the [Apollo explorer sandbox](https://studio.apollographql.com/sandbox/explorer) and changing the endpoint to point at my VPC at https://damon314159.co.uk

You can add your Bearer tokens for auth purposes in the headers panel under the query editor after making a register or login request. Ensure you match the `Authorization: Bearer <token>` format.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up environment variables:

- Copy `.env.template` to `.env`
- Fill in the required variables:
  - `NODE_ENV`: development/production
  - `PORT`: API server port
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret key for JWT token generation

3. Set up the database:
   ```sh
    npm run db:migrate # Apply migrations
    npm run db:seed # Seed the database (optional)
   ```
4. Start the development server
   ```sh
   npm run build && npm run dev
   ```

The API will be available at `http://localhost:7007` (or your configured port).

The seeded database contains two example users to get started with:

```js
const user1 = {
  username: "admin",
  password: await hashPassword("admin123"),
  role: "ADMIN",
};
const user2 = {
  username: "user",
  password: await hashPassword("user123"),
  role: "USER",
};
```

## Architecture

### GraphQL Schema Design

The API uses a modular GraphQL schema approach with separate schema files for different entities:

- `user.graphql` - User authentication and management.
- `course.graphql` - Course management operations.
- `collection.graphql` - Collection-related types and operations.

### Key Features

- Type-safe GraphQL schema with TypeScript.
- JWT-based authentication.
- Role based access control. You must register/login as a user, and provide your JWT as a Bearer token to perform mutations. Additionally, you must have an ADMIN role to delete courses.
- Modular resolver organization.
- Postgres Database access via Drizzle ORM.
- Repository/Service/Resolver pattern with strong interfaces and DI.
- Comprehensive unit tests for Repository and Service layers with centrally managed mocks.

## Future Enhancements

If there had been more time to work on this project, I would have liked to implement:

1. Auto Generated API Documentation

   - Add a GraphQL schema documentation generator for convenient printouts.
   - Add API usage examples to go along with the above.

2. Extra Features

   - Implement pagination for courses and collections.
   - Add filtering capabilities based on fields besides ID.
   - Add relations between Users and other entities so that Users can own courses or collections.

3. Technical Improvements

   - Add more comprehensive test coverage, including integration and e2e testing.
   - Implement caching/batching layer for performance concerns.
   - Set up CI/CD pipeline
   - Add Docker support to speed up and automate deployment

4. Security
   - Add input validation with a library like Zod to ensure fields are provided as expected.
   - Implement request throttling
   - Add security headers, particularly when interfacing with browser clients.
   - Set up audit logging and monitoring with a service like Sentry or Cloudflare
