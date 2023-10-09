FROM node:18
WORKDIR /ft_transcendence
COPY ./apps/frontend /ft_transcendence/apps/frontend

VOLUME ["/ft_transcendence/node_modues"]
RUN npm install -g npm && npm install -D turbo

WORKDIR /ft_transcendence/apps/frontend
RUN npm install vite
# && npm prune --scope=frontend --docker
RUN ls -la
RUN pwd
# RUN npm install -g npm && npm install -D turbo
# COPY ./.env ft_transcendence/apps/frontend/.env


# COPY ./package.json ft_transcendence/apps/frontend/package.json
EXPOSE 5173
CMD ["npm", "run", "dev"]