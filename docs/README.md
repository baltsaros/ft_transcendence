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
After cloning the repo, you need to:
* install *NodeJS* (via *Software Manager* on Mac)
* run *npm install* in the root folder to install all the dependencies 
* install *Postgresql* (via VM on Mac)
* create *.env* in the root folder
* install *ES7+ React/Redux/React-Native snippets* VS Code extension and optionally *Prettier*

## Some commands
* *npm run dev* - to launch both apps in the develpment mode; to access the NestJS server go to *localhost:3000/api*; to access the React server go to *localhost:5173*
* *npm run build* - to build apps
* *npm run start* - to start NestJS server with React build in the production mode; only *localhost:3000* will work in this case; also need to have .env in the root directory


## Project structure
* apps - folder for frontend and backend parts
* node_modules - contains necessary modules for Turborepo, NestJS and React. Should be in .gitignore
* turbo.json - config for turborepo
* package.json - contains commands for turborepo../README.md

## NEstJS terms
* dto is  a sort of schema/model to parse request body
* entity looks like dto, but it describes/defines database structure
* strategy defines how authentication is carried out
* guards check whether access rights and allow/disallow incoming requests

## How does authentication work
* When you try to authorize with 42 API on the frontend, it redirects you to the backend (*3000/api/auth/redir*)
* This backend's page is protected by the 42 guard (*42.guard.ts*). The guard first connects to the 42 API with the provided UID and secret. If the credentials are correct, the backend receives your data from 42 side
* Then this data is sent to the special strategy, linked to this guard (*42.strategy.ts*). It calls a function (*validateUser*) that checks whether you are in the database. If not, it creates a new DB entity with your data
* *validateUser* function returns your user data from the DB and 42 access token. These parameters are used to create a new (jwt) *access token* that is used to authenticate you and grant access to pages on both backend and frontend
* Some of your data (like username, email, avatar) and access token are saved in the cookies in order to allow the fronted to authenticate you and to make calls to the backend
* For example, to retrieve a user's data from the db, the frontend makes a call to the backend (*3000/api/auth/profile*). This page is protected by the *jwt guard* that checks *jwt access token* that we created earlier. If the token is correct, it return the requested data
* You can get more information in the official nestjs documentation [here](https://docs.nestjs.com/security/authentication) and [here](https://docs.nestjs.com/recipes/passport)


# Setting up the project from zero
* Below are just some instructions and commands for when you start a new project 

## Setting up the environment
* Install turborepo. It allows to connect backend with frontend: *npm install -D turbo*
* Install tailwind. It is a CSS utility: npm install -D tailwindcss postcss autoprefixer
* Inside *apps* create nestjs project: *npx nest new backend*
* In the same folder create React project with Vite: *npm create vite@latest frontend*
* Set up dependencies in the root directory: *npm install*
* Install a package to serve static content for a single page application from the root directory: *npm install --workspace backend --save @nestjs/serve-static*
* In the root directory create and set up *turbo.json*, set up *package.json*, edit *vite.config.ts* in the frontend, edit *main.ts* and *app.module.ts* in the backend

## Setting up a database with PostgreSql on a VM
The database is located on a VM using a debian image. The vm does not contain a graphic interface.
The databse will listen to the port `5432`.

*  Create a VM with virtual box using debian Os : https://www.debian.org/download

### Install sudo and create a super user
* Login as a user : `su -`
* Check for any update : `apt get update -y`
* Apply update : `apt get upgrade -y`
* Installing sudo : `apt get install sudo`
* Add your username to sudo group : `usermod -aG sudo your_username`
* Add the rule in the `/etc/sudoers` file : `nano /etc/sudoers` and add `your_username  	ALL=(ALL) ALL`

### Install PostgreSql
⚠️ : You can do it as sudo or you can go back to your account.
* Install PostgreSql : `sudo apt install postgresql postgresql-contrib`
* You can check if the service is running by using : `sudo systemctl status postgresql`
* If the service isn't running you can use : `sudo systemctl start postgresql`
* And `sudo systemctl stop postgresql` if you want to stop it.

### Create an empty database
* Enter in postgresql shell : `sudo -u postgresql psql`
* Create an empty database : `create database mydb;` ⚠️ Don't forget the `;` at the end of the command. Replace `mydb` by your db.
* Create a user who can access the database : `create user myuser with encrypted password 'mypass';` Replace `myuser` and `mypass` by your user and password.
  ⚠️ This will be the same user and password as it is in you `.env` file in your pong application
* Grant access to the new user to your database : `grant all privileges on database mydb to myuser;` Replace `mydb` and `myuser` by your db name and your user.

### Open port on the VM and virtual box
* Access the conf file of postgresal : `sudo nano /etc/postgresql/XX/main/postgresql.conf`. Replace the `XX` by the version of postgreSql installed on your computer. For us it was the 13.
* Change `listen_addresses = 'localhost'` to `listen_addresses = '*'`
* Add the line : `host all all all md5` in the `/var/lib/pgsql/data/pg_hba.conf` file.
* Restart the PostgreSql service : `sudo systemctl restart postgresql`
* In virtual box go to your virtual box settings and go to Network.
* Click on `advanced` and then on the button at the bottom : `Port Forwarding`.
* Add a rule by clicking the 'plus' button ![image](https://github.com/baltsaros/ft_transcendence/assets/107465256/35b765d5-565d-4eeb-935f-b35345b47009)
* Add port `5432` in the host port and the guest port : ![image](https://github.com/baltsaros/ft_transcendence/assets/107465256/12410f2d-a5ec-43a3-8efd-07e0379ed4a6)
* Click two times on `OK` and then reboot your VM : `sudo reboot`

👌 You can now access an empty database running on a VM on your computer.  
⚠️ The Vm needs to run and the service needs to be active if you want to have access to your database.


## Installing DB on the backend
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

## 42 authentication
* help to connect to 42 API: sudo npm install --save passport-42
* middleware to save the current session: sudo npm install --save express-session @types/express-session (leaking, only for dev)
* sudo npm install --save js-cookie

## Local authentication
* sudo npm install --save passport @nestjs/passport passport-local @nestjs/jwt passport-jwt
* sudo npm install --save-dev @types/passport-local

## 2FA authentication
* install otplib to work with Google Authenticator: npm install --save otplib
* install qrcode to generate qrcode: npm install --save qrcode

## Pages in frontend
* npm install --save react-router-dom localforage match-sorter sort-by
* some design: npm install --save react-icons
* for api routing: npm install --save axios
* for floating messages: npm install --save react-toastify
* tools for login: npm install --save @reduxjs/toolkit react-redux

## Tailwind
* Install tailwind: npm install -D tailwindcss postcss autoprefixer
* Official website (it has various useful docs): https://tailwindcss.com/
* To setup, edit tailwind.config.js, index.html (link to fonts), index.css (styling)
* Fonts: https://fonts.google.com/
* Install forms for tailwind: npm install -D @tailwindcss/forms
* Install plugin for prettier: npm install -D prettier prettier-plugin-tailwindcss

## Cookies for react
* Install react-cookie : `npm install --save js-cookie @types/js-cookie`

## Docker
* sudo docker rm -f $(sudo docker ps -a -q) - delete all containers
* sudo docker rmi -f $(sudo docker images -q) - delete all images
* sudo docker logs CONTAINER_NAME - check logs for container with CONTAINER_NAME
* sudo docker exec -it CONTAINER_NAME /bin/bash - launch bash in CONTAINER_NAME
* sudo docker-compose up --build - run dockers-compose
* stop all the containers - sudo docker stop $(sudo docker ps -q)

## Makefile rules
* build - normal build
* silent - installation with less messages and silent launch (without logs)
* start - start containers
* stop - stop containers
* down - stop containers and removes containers, networks, volumes, and images created by up
* clean - remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes
* fclean - force clean