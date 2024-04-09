FROM node

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./

RUN npm install --global npm@latest
RUN npm install --global pnpm@latest

RUN pnpm install

COPY . .

EXPOSE 3000

CMD [ "pnpm", "start:dev" ]