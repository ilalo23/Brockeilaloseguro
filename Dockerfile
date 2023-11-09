FROM node:lts-alpine3.14 AS server
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine3.14 as prod-stage-server
WORKDIR /app
COPY --from=server /app ./
CMD ["npm", "run", "start:prod"]

