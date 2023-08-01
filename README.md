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

## Tailwind
* Install tailwind: npm install -D tailwindcss postcss autoprefixer
* Official website (it has various useful docs): https://tailwindcss.com/
* To setup, edit tailwind.config.js, index.html (link to fonts), index.css (styling)
* Fonts: https://fonts.google.com/
* Install forms for tailwind: npm install -D @tailwindcss/forms
* Install plugin for prettier: npm install -D prettier prettier-plugin-tailwindcss

## Cookies for react
* Install react-cookie : `npm install react-cookie`
