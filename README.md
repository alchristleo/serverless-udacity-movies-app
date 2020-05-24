# Serverless Movies Queue App

To implement this project, you need to implement a simple Movie Queue application using AWS Lambda and Serverless framework. Search for all comments starting with the `MOVIE:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow creating/removing/updating/fetching MOVIE items. Each MOVIE item can optionally have an attachment image. Each user only has access to MOVIE items that he/she has created.

# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetMovies` - should return all MOVIEs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "attachmentUrl": "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A34de8fd0-4145-42b0-a668-a0618c9a3092",
      "createdAt": "2020-05-23T19:52:09.660Z",
      "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      "done": false,
      "duration": "120",
      "movieId": "34de8fd0-4145-42b0-a668-a0618c9a3092",
      "name": "Parasite",
      "rating": "8.5",
      "userId": "google-oauth2|106984203500731568145"
    },
    {
      "attachmentUrl": "https://serverless-movieapp-images-dev.s3.amazonaws.com/google-oauth2%7C106984203500731568145%3A60ad029c-93c7-4611-96af-4c439016557c",
      "createdAt": "2020-05-23T19:53:54.231Z"
      "description": "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
      "done": false,
      "duration": "125",
      "movieId": "60ad029c-93c7-4611-96af-4c439016557c",
      "name": "Money Heist",
      "rating": "8.8",
      "userId": "google-oauth2|106984203500731568145"
    }
  ]
}
```

* `CreateMovie` - should create a new MOVIE for a current user. A shape of data send by a client application to this function can be found in the `CreateMovieRequest.ts` file

It receives a new MOVIE item to be created in JSON format that looks like this:

```json
{
  "description": "some description",
  "duration": "111",
  "name": "some movie name",
  "rating": "3.5",
}
```

It should return a new MOVIE item that looks like this:

```json
{
  "item": {
    "attachmentUrl": "",
    "createdAt": "2020-05-24T08:40:35.477Z",
    "description": "some description",
    "done": false,
    "duration": "111",
    "movieId": "b1e68028-d23a-4c8a-bbac-3cc2a1b1b54c",
    "name": "some movie name",
    "rating": "3.5",
    "userId": "google-oauth2|106984203500731568145",
  }
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteMovie` - should delete a MOVIE item created by a current user. Expects an id of a MOVIE item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a MOVIE item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Suggestions

```yml

MoviesTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.MOVIES_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
npm install -g serverless
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```
