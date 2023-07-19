FROM node:latest

WORKDIR /home/jvander/trans/

COPY . /home/jvander/trans/


RUN npm i -D @types/react

RUN npm install vite
RUN npm install -D turbo
RUN npm run build

CMD ["npm", "run", "start", "daemon off;"]