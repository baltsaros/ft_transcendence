FROM node:18
WORKDIR /ft_transcendence
COPY  ./package.json .
COPY  ./package-lock.json .
COPY  ./turbo.json  .
COPY  ./.env  .
COPY ./apps/backend /ft_transcendence/apps/backend

RUN npm install -g npm && npm install -D turbo

RUN apt update && apt upgrade \
  && apt install -y libssl-dev postgresql-client -y --no-install-recommends \
  && apt autoremove -y && apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /ft_transcendence/apps/backend

# RUN npm prune --scope=backend --docker

# WORKDIR /ft_transcendence

# COPY  ./.env  .
# COPY apps/backend/package.json ft_transcendence/apps/backend/package.json
# COPY apps/backend/.env ft_transcendence/apps/backend/.env
EXPOSE 3000
WORKDIR /ft_transcendence/apps/backend
CMD ["npm", "run", "dev"]
