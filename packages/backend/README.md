# Magus Backend

## Description

Our backend is based on [NestJS](https://docs.nestjs.com) with [GraphQL](https://docs.nestjs.com/graphql/quick-start) configurations.

## Pre Requirements

### Generating RSA Keys

-   First of all you need to generate RSA key for signing JWT token.

```
ssh-keygen -t rsa -b 2048 -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

-   We need public and private key as one line since we want to set them as environment variables.

```
awk -v ORS='\\n' '1' jwtRS256.key | pbcopy
```

### Setting Environment Variables

We're using [nestjs-config](https://github.com/nestjsx/nestjs-config) to configure our modules based on different environment, it's based on the `.env` file in a fancy way. All of the configurations have been categorized on the `config` path. you could see the defaults values as well.

To setting environment variables see the `.env_sample` file, copy them to `.env` based on your configurations, these values will be override the default ones.

### Initial the Project

We have some GraphQL mutations to initial necessary data on the database.

These mutations are protected by `SystemGuard`, so the `system-key` HTTP headers should be set on the GraphQL playground.

#### Create the PWA Client

```
mutation {
  initialPWAClient{
    ... on MutationStatus {
       isSucceeded
      message
    }
    ... on Client{
      id
      key
      deviceType
      createdAt
      updatedAt
      isWebApp
    }
  }
}
```

#### Create Admin User

```
mutation {
  initAdminUser{
    isSucceeded
    message
  }
}
```

> NOTE: the administrator email address is set by `ADMIN_EMAIL_ADDRESS` env and the default value is `admin@magus.ir`.

## Install Dependencies

We've used [Lerna](https://github.com/lerna/lerna) so all of the dependencies will be installed by running `yarn install` on the root of project.

## Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
