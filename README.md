# **The Booking Table System Administrator App (Demo project)**

## **Description**
---
Toy web application for demo purposes that simulates the booking system for restaurants. Users can access to a web application where they can book a table on a "fake" restaurant after selecting a day and timeslot. Moreover, restaurant administration staff can register and manage the restaurant availability and their bookings, being able to see all current reservations while being able to add, edit and delete existing ones from the system.


## **How to install and run it**
---
The complete application environment is configured to work just out-of-the-box thanks to docker containers and docker-compose.

### **Requirements**
 - Have already installed Docker and docker-compose
    - https://docs.docker.com/get-docker/
    - https://docs.docker.com/compose/install/
 - aprox 1Gb free space on HDD
 - Web browser (Chrome/Firefox/Edge/Safari)...

 ### **How to run**
 On your terminal go to the root folder where the docker-compose.yml is located and run the following command:
 ```console
 > docker compose -f "docker-compose.yml" up -d --build
 ```

 ### **How to stop**
 Run the following command:
```console
 > docker compose -f "docker-compose.yml" down -d
 ```

 ### **Other useful commands**
 - To delete all containers using the following command:
 ```console
 > docker rm -f $(docker ps -a -q)
 ```

- To delete all volumes using the following command: (!)(All data will be lost)
```console
 > docker volume rm $(docker volume ls -q)
 ```

## **How to use it**
---
After installation, the different application portals will be accessible to enter on your localhost
- Frontend App: http://localhost:3000/
- Swagger REST interface: http://localhost:8080/api/
- Database Administrator: http://localhost:8081/
    - >Default user/pwd defined on docker-compose.yml      ME_CONFIG_BASICAUTH_USERNAME
    ME_CONFIG_BASICAUTH_PASSWORD
>Ports are defined on the docker-compose.yml file, in case of port collision, feel free to modify them there.

##  **Architecture components and technologies**
---
The web application is thought to be distributed deployed. It is composed mainly by three independent servers based on the classical client server architecture.
1. Database server
2. Application server/Web server
3. Client Server/Presentation Layer/UI

These server applications are deployed inside independent containers connected each other on an internal subnet using docker. Moreover, all configuration and environment variables are managed using a docker-compose config file to gather all container configuration gather together and making the deployment a one-command task. 

### **Data storage**
Data is stored using a Document database (nosql) using MongoDB. Bookings are saved as independent documents with a flexible schema into a collection and the restaurant information on another one, without any dependency among them. Making it easy to distribute and scalate horizontally.

A Mongo Express application is included on the application system (port 8081 by default ) to give developers and user direct GUI web access to the database without installing anything additional (no mongoDB compass required :) ).

### **Backend API**
API is designed following the RESTful architecture to provide a general application interface for different client applications giving them full CRUD access to its domain logic and resources.
The reason behind it is to provide the possibility, for different purpose applications, to use the API bussiness logic and resources on a standarized and uniform manner using an unique API. 

Data is communicated using http standard methods (GET/POST/PUT/DELETE/PATCH) and all requests are stateless and undependent.

The API is implemented using Typescript (https://www.typescriptlang.org/docs/) and the framework NestJS (https://docs.nestjs.com/) that provides a level of abstraction above Node.js and Express framework with a strong layer separation architecture.

>Nest.js provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. 
https://docs.nestjs.com/#philosophy

Some relevant used modules are Mongoose (https://mongoosejs.com/docs/guide.html) as the ORM (Object–relational mapping) to manage the mongoDB data access and Jest for testing. (https://jestjs.io/docs/getting-started)

### **Client Application**
User interface (The client app) offers the GUI layer to all different users to interact within the application with just their web browser.

It is implemented using Typescript and the React library to create all different UI components in a modular and reusable way. (https://reactjs.org/docs/getting-started.html)

Relevant React modules:
- **Bootstrap**: To provide an easy and out-of-the-box component styling flexible and ready to use 
- **React Query and Axios**: To mantain the backend state and fetch data from the API server
- **React Router**: To provide URL navigation on the application while being a one-page application (no page reloading)

## **Improvements / Pendent work**
---
(v.0.1)
- Client-side form validation. Currently just backend validation is implemented
- UI component improvement
- A basic admin GUI is implemented. Restaurant client GUI is yet to be implemented.
- GUI Booking table filter and sorting capabilities
- And many more...