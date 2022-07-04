# Notes

Application with tech stack:

- NestJS
- GraphQL
- Apache Kafka -> communication between two microservices
- Next.js
- Apollo Client (GraphQL)

## Fuctionalities

### Purchase Service (1 Microservice)

- [Admin] Register products
- [Admin] List products

- [Auth] List purchases

- [Public] Purchase a product
- [Public] List available products to be purchased

### Classroom Service (1 Microservice)

- [Admin] List enrollments
- [Admin] List students
- [Admin] List courses
- [Admin] Register Classes

- [Auth] List courses that user has access
- [Auth] Access courses content



# Goals Class 1
- Project setup
- Authentication using Auth0
  - Free up to 7,000 active users
  - Alternatives: Amazon Cognito (not as much support in the community, but it's free up to 50,000 active users), keycloak (open source but not as easy setup as Amazon Cognito and Auth0), supertokens (newer with a drawback that it does not have control of role and attribute access), firebase
  - 1st: create a tenant (microservice scope)
- NestJS is a NodeJS framework with a lot of resources
  - everything is a class
  - uses dependency inversion, decorators with TS

## NestJS
### Module
Module is a file that unite parts of our application (other files).
providers: services (domain and application), Data mapper pattern -> repositories, use cases (file that contains a functionality)
controller: routes

Controller has routes that calls services that contains the business logic
  Uses the decorator to indicate that the class is a controller and to expose methods inside the class as routes. Decorators connect classes with day-to-day functionalities we are used to in the backend world

## Setup Auth0 for Authentication
Auth0 Dashboard -> Applications -> APIs -> Create API

Nest has generators, we can use nest generate <something> (global) or npx nest generate <something> (local)
```
// Get all types of generators
nest generate -h 
```

We will start to decouple the app by using modules:
- database
- http (routes, graphQL)
```
nest generate module database
```

Since we will use .env file, we need to install `npm i @nestjs/config`


```
// guard = middleware
// -no-spec = without the test file
nest generate guard authorization --no-spec
```

promisify -> transforms callbacks functions into async

## Setup Frontend Web
Every frontend is a new application in auth0 because it will use the Public API

Install package for nextjs to make authentication via server side
```
yarn add @auth0/nextjs-auth0
```

To create a AUTH0_SECRET run:
```
openssl rand -hex 32
```

## Setup database with prisma
Install it as a dev dependency
```
npm i prisma -D
```

Start prisma with
```
npx prisma init
```

We need a database running in our local to make prisma to work (local or docker)
```
docker-compose up
```

Run migration after adding a model to prisma schema
```
npx prisma migrate dev
```

Install prisma client
```
npm i @prisma/client
```

Generate a service for database
```
nest generate service prisma
```

Interfaces OnModuleInit, OnModuleDestroy give functionalities from nest when we are instantiating or removing a module

To check the database
```
npx prisma studio
```

## Setup GraphQL
https://docs.nestjs.com/graphql/quick-start

controller -> becomes resolver

## Purchases
It's really important that the database tables for this services to be in the purchase domain. When working with microservices, it's important to bring the naming of our entities the closest to the context of the application. EX: Domain - purchase; who buys the product -> customer not user (user is too generic).

## Purchase

services -> receive the customer id because we are in a service layer of the app, so we don't have access to the context of the request
resolver -> don't receive customerId in data because customerId is not an information that the frontend will send. The customerId will be acquired through the context of the request because the user is already authenticated

## List "my" purchases
Now we need to know what are the purchases of a logged in user. Currently, the Customer table has no reference of a customer.

We will add a customer reference to the purchase between Purchases service and user from Auth0

Each user in Auth0 has a unique id

In the customer table, I will add a reference to Auth0 unique id for the logged in user (authUserId). Adding the field as optional because we can provide other ways to get a customer id that does not come from auth0.