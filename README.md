# Surbana - Home Assignment

This is a backend server application using NestJS framework with Typescript. The backend server provides the APIs allow to load, create, update and delete Locations.

## Requisition

-   Install NodeJS: https://nodejs.org/en/download/package-manager
-   Install and setup Postgre: https://www.postgresql.org/docs/current/tutorial-install.html

## Setup and run

-   Update database connection in .env file
-   Run command to run service as development test
    ```bash
    npm install
    npm start
    ```
-   By default the application can be access from http://localhost:3000

## APIs

The APIs available for managing locations:

-   Get all locations including their childrens:
    -   GET http://localhost:3000/location
-   Get a location with specific ID:
    -   GET http://localhost:3000/location/(locationID)
-   Create a new location:
    -   POST http://localhost:3000/location
    -   Example body JSON:
        ```bash
        {
            "building": "A",
            "locationName": "Cafe Level 1",
            "locationNumber": "A-01-Cafe",
            "area": 80.620,
            "parentId": 6
        }
        ```
-   Update a location with specific ID:
    -   PATCH http://localhost:3000/location/(locationID)
    -   Example body JSON:
        ```bash
        {
            "locationName": "Parking Level 1",
            "locationNumber": "A-01-Parking",
        }
        ```
-   Delete a location with specific ID:
    -   DELETE http://localhost:3000/location/(locationID)
