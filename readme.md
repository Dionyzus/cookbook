Cookbook

### Cookbook full stack application

Simple full stack application written in MERN stack. It contains  cooking recipes whether it is a cake or a simple lunch, it has everything.

#### Cookbook API

API exposing endpoints below:

- get recipe collection [http://localhost:8080/api/recipes]() GET

- get single recipe by an Id [http://localhost:8080/api/recipes/{id}]() GET

- search recipes by text, name or ingredient [http://localhost:8080/api/recipes/search?]() GET

- update recipe by an Id  [http://localhost:8080/api/recipes/{id}]() PUT

- patch recipe by an Id http://localhost:8080/api/recipes/{id} PATCH

- delete recipe by an Id http://localhost:8080/api/recipes/{id} DELETE

To access pagination add limit and offset query params.

Eg. [http://localhost:8080/api/recipes?limit=2&offset=1]()

#### Cookbook client

Frontend in react to work with an API. Display collection of items,  view and edit and delete certain items.

Acess collection of items via  [http://0.0.0.0:3000/recipes]() . It will display table with recipes and actions related to them.

#### Requirements

- docker

- docker-compose

#### Installation

Clone cookbook and cookbook-client repos, unzip them in a folder eg. cookbook-fullstack. Move docker-compose.yaml file from cookbook folder to a created root folder (cookbook-fullstack).

In the end structure should be:

 /cookbook-fullstack/: 

- cookbook

- cookbook-client

- docker-compose.yaml

Rename .testEnv file to .env and fill out missing fields.

To run the application run command: `docker-compose up`  to shut it `down docker-compose down` .

#### Testing API endpoints

It will run both application. In a browser access application via [http://0.0.0.0:3000/recipes]() or access API directly using postman root: [http://localhost:8080/api/recipes]() .If for any reason postman can't get response use:

[http://0.0.0.0:8080/api/recipes]() .

To run unit tests change directory into root directory (eg. /cookbook-fullstack)  and run `docker-compose exec cookbook npm test` .
