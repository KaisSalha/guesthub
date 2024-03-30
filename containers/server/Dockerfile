# containers/server/Dockerfile.prod
FROM node:20

WORKDIR /app

COPY apps/server/package*.json ./
RUN npm install

COPY apps/server/ .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
