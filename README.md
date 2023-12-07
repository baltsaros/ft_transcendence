# ft_transcendence

## About the project
* The project is about creating a single page application for the old arcade *Pong* game
* The backend is written in *NestJS*
* *React* is used for the frontend
* *Postgresql* is our database, it is managed with *TypeORM*
* *Tailwind* is used to handle CSS
* *Turborepo* is used to create a monorepo
* The project is dockerized
* To access the application, one must login with 42 API
* The application has friend and ignore lists, match history and a chat with the possibility to create public and private (protected) channels. The game has basic customization. A user can change username, avatar and enable/disable two-factor authentication
* For two-factor authentication it is required to have Google authenticator to scan a QR-code

## The team
* Jérémy Vander Motte (42: [jvander-](https://profile.intra.42.fr/users/jvander-)/git: [JeremyVanderMotte](https://github.com/JeremyVanderMotte))
* Hadrien Dony (42: [hdony](https://profile.intra.42.fr/users/hdony)/git: [hdony640](https://github.com/hdony640))
* Aleksandr Buzdin (42: [abuzdin](https://profile.intra.42.fr/users/abuzdin)/git: [baltsaros](https://github.com/baltsaros))
* Arthur Demurger (42: [ademurge](https://profile.intra.42.fr/users/ademurge)/git: [ademurge](https://github.com/arthurdemurger))
* Elsa Joo Thomson (42: [ejoo-tho](https://profile.intra.42.fr/users/ejoo-tho)/git: [ejt22](https://github.com/ejt22))


## Makefile rules
* build - normal build
* silent - installation with less messages and silent launch (without logs)
* start - start containers
* stop - stop containers
* down - stop containers and removes containers, networks, volumes, and images created by up
* clean - remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes
* fclean - force clean

## Project structure
* apps - folder for frontend and backend parts
* docs - folder for some documentation
* pics - folder for screenshots
* node_modules - contains necessary modules for Turborepo, NestJS and React. Should be in .gitignore
* turbo.json - config for turborepo
* package.json - contains commands for turborepo

### Backend (src)
* *auth* - module that is responsible for 42 and local authentication; it also has *getProfile()* function that receives a frontend request, does security checks and, if everything is fine, returns a user data
* *user* - module that is responsible for manipulation with user data (including creation, update and possible removal)
* *channels* - module that is responsible for handling a chat
* *messages* - not currently used?
* *uploads* - a folder for received files (like user avatars)
* *helpers* - a folder for helper functions; *data-storage.service.ts* is not used, since it is a not reliable way to store data
* *types* - a folder for defining interfaces
* *main.ts* - entry file for the backend

### Frontend (src)
* *api* - a module that is used to make axios requests to the backend; it creates an axios instance with the stored access token
* *assets* - a folder for images and similar files used by React
* *components* - contains frontend components
* *helpers* - a folder for helper functions; *localstorage.helper.ts* is currently not used, since it does not work perfectly
* *hooks* - a folder for hooks functions; for example, *useAuth()* checks redux data to determine whether a user is logged in or not
* *pages* - contains main pages
* *router* - *router.tsx* contains links to all used pages that is used later by *react-router-dom*; inside it is possible to define a default index page, error page, protect pages
* *services* - a folder for services; *auth.service.ts* handles authentication and related calls to the backend
* *store* - a redux folder that is used to store data
* *types* - a folder for interfaces
* *main.tsx* - frontend entry file
* *App.tsx* - out main page; all other pages are injected in it; check authentication
* *index.css* - file where many tailwind parameters are defined

## Screenshots
42 authentication:
![42 authentication](https://github.com/baltsaros/ft_transcendence/blob/main/pics/auth.png)

Home page:
![home page](https://github.com/baltsaros/ft_transcendence/blob/main/pics/home.png)

Profile page:
![profile edit](https://github.com/baltsaros/ft_transcendence/blob/main/pics/profile.png)

Drop down menus:
![Drop down menu 1](https://github.com/baltsaros/ft_transcendence/blob/main/pics/DDmenu1.png)
![Drop down menu 2](https://github.com/baltsaros/ft_transcendence/blob/main/pics/DDmenu2.png)

Chat:
![Chat](https://github.com/baltsaros/ft_transcendence/blob/main/pics/chat.png)

Game customization:
![Game customization](https://github.com/baltsaros/ft_transcendence/blob/main/pics/gameCustomization.png)

Game:
![Game](https://github.com/baltsaros/ft_transcendence/blob/main/pics/game.png)

Match history:
![Match history](https://github.com/baltsaros/ft_transcendence/blob/main/pics/result.png)