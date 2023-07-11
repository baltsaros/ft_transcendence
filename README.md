# ft_transcendence

## Setting up environment
* Install turborepo. It allows to connect backend with frontend: *npm install -D turbo*
* Inside *apps* create nestjs project: *npx nest new backend*
* In the same folder create React project with Vite: *npm create vite@latest frontend*
* Set up dependencies in the root directory: *npm install*
* Install a package to serve static content for a single page application from the root directory: *npm install --workspace backend --save @nestjs/serve-static*
* In the root directory create and set up *turbo.json*, set up *package.json*, edit *vite.config.ts* in the frontend, edit *main.ts* and *app.module.ts* in the backend

#Installing TypeORM to handle db and PostgreSQL as db driver: npm install --save @nestjs/typeorm typeorm pg

## Some commands
* *turbo run build* - to build apps
* *turbo run start* - to start NestJS server with React build in the production mode; only *localhost:3000* will work in this case
* *turbo run dev* - to launch both apps in the develpment mode; to access the NestJS server go to *localhost:3000/api*; to access the React server go to *localhost:5173*

## Project structure
* apps - folder for frontend and backend parts
* node_modules - contains necessary modules for Turborepo, NestJS and React. Should be in .gitignore
* turbo.json - config for turborepo
* package.json - contains commands for turborepo




