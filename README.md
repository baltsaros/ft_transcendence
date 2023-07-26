# ft_transcendence

## Preprequisites:
* Installing nodejs on ubuntu:
>cd ~
>
>curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
>
>sudo bash nodesource_setup.sh
>
>sudo apt install -y nodejs
>
* To check versions:
>node -v
>
>npm -v
>

## Setting up environment
* Install turborepo. It allows to connect backend with frontend: *npm install -D turbo*
* Install tailwind. It is a CSS utility: npm install -D tailwindcss postcss autoprefixer
* Inside *apps* create nestjs project: *npx nest new backend*
* In the same folder create React project with Vite: *npm create vite@latest frontend*
* Set up dependencies in the root directory: *npm install*
* Install a package to serve static content for a single page application from the root directory: *npm install --workspace backend --save @nestjs/serve-static*
* In the root directory create and set up *turbo.json*, set up *package.json*, edit *vite.config.ts* in the frontend, edit *main.ts* and *app.module.ts* in the backend

## Some commands
* *turbo run build* - to build apps
* *turbo run start* - to start NestJS server with React build in the production mode; only *localhost:3000* will work in this case; also need to have .env in the root directory
* *turbo run dev* - to launch both apps in the develpment mode; to access the NestJS server go to *localhost:3000/api*; to access the React server go to *localhost:5173*
* if the aforementioned commands do not work, replace *turbo* with *npm*

## Project structure
* apps - folder for frontend and backend parts
* node_modules - contains necessary modules for Turborepo, NestJS and React. Should be in .gitignore
* turbo.json - config for turborepo
* package.json - contains commands for turborepo


## DB
* installing dependancies; typeorm connects nestjs and postgresql: npm install --save @nestjs/config @nestjs/typeorm typeorm pg
* download and install postgresql: https://www.postgresql.org/download/
* you can also install db beaver to manage databases
* create a new user and a new database:
>sudo -u postgres psql
>
>postgres=# create database [DB_NAME];
>
>postgres=# create user [DB_USER] with encrypted password '[DB_PASS]';
>
>postgres=# grant all privileges on database [DB_NAME] to [DB_USER];
>

* grant access right on public schema:
>sudo -i -u postgres
>
> psql
>
>\c [DB_NAME] postgres;
>
>GRANT ALL ON SCHEMA public TO [DB_USER];
>
* to validate input: sudo npm install --save class-validator class-transformer
* to hash password: sudo npm install --save argon2 (if it does not work, add *--ignore-scripts*)

## Oauth2
* sudo npm install --save passport @nestjs/passport passport-local @nestjs/jwt passport-jwt
* sudo npm install --save-dev @types/passport-local

## NEstJS terms
* dto is  a sort of schema/model to parse request body
* entity looks like dto, but it describes/defines database structure
* strategy defines how authentication is carried out
* guards check whether access rights and allow/disallow incoming requests

## Pages in frontend
* npm install --save react-router-dom localforage match-sorter sort-by
* some design: npm install --save react-icons
* for api routing: npm install --save axios
* for floating messages: npm install --save react-toastify
* tools for login: npm install --save @reduxjs/toolkit react-redux
