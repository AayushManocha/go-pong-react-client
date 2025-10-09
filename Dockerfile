
FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

ENV VITE_SERVER_URL=https://go-game-server-mcsmp.ondigitalocean.app

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ENV VITE_SERVER_URL=https://go-game-server-mcsmp.ondigitalocean.app
RUN npm run build

FROM nginx
COPY --from=build-env ./app/build/client /etc/nginx/html/
COPY --from=development-dependencies-env ./app/nginx.conf /etc/nginx

# EXPOSE 80

# FROM node:20-alpine
# COPY ./package.json package-lock.json /app/
# COPY --from=production-dependencies-env /app/node_modules /app/node_modules
# COPY --from=build-env /app/build /app/build
# WORKDIR /app
# CMD ["npm", "run", "start"]

# EXPOSE 3000

# CMD ["bash"]
