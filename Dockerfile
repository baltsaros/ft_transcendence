FROM node:18
WORKDIR /ft_transcendence
COPY  ./package.json .
COPY  ./package-lock.json .
COPY  ./turbo.json  .
COPY  ./.env  .
COPY ./apps /ft_transcendence/apps

RUN npm install -g npm && npm install -D turbo

RUN apt update && apt upgrade \
  && apt install -y libssl-dev postgresql-client -y --no-install-recommends \
  && apt autoremove -y && apt clean && rm -rf /var/lib/apt/lists/*

# RUN pwd
# RUN ls -la *
# RUN npm install

# RUN npm prune --scope=backend --docker
WORKDIR /ft_transcendence/apps/frontend
RUN pwd && npm install

WORKDIR /ft_transcendence

EXPOSE 5173 3000 5432
# RUN npm run build
# CMD ["npm", "run", "start"]
CMD ["npm", "run", "dev"]