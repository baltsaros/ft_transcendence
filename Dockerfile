FROM node:18
WORKDIR /ft_transcendence
COPY  ./package.json .
COPY  ./package-lock.json .
COPY  ./turbo.json  .
COPY  ./.env  .
COPY ./apps /ft_transcendence/apps

RUN npm install -g npm && npm install -D turbo

RUN apt update \
  && apt install -y libssl-dev postgresql-client -y --no-install-recommends \
  && apt autoremove -y && apt clean && rm -rf /var/lib/apt/lists/*


# plan B
# RUN npm install react-router-dom localforage match-sorter sort-by react-toastify react-dom
# WORKDIR /ft_transcendence/apps/frontend
# RUN npm install react-router-dom localforage match-sorter sort-by react-toastify react-dom
# WORKDIR /ft_transcendence

EXPOSE 5173 3000 5432
# RUN npm run build
# CMD ["npm", "run", "start"]
CMD ["npm", "run", "dev"]
# ENTRYPOINT []