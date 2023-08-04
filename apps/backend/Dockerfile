FROM node:18

WORKDIR /home/jvander/trans/

COPY package*.json ./

RUN npm i -D @types/react

RUN npm install vite
RUN npm install -D turbo
RUN npm run build

CMD [ "node", "dist/main.js" ]