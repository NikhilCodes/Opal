# Install dev dependencies
FROM node:24-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --production=false
COPY . .

# Install only prod dependencies
FROM node:24-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --production=true

# Build the app
FROM node:24-alpine AS build-env
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN yarn build

# Final runtime image
FROM node:24-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/public ./public
EXPOSE 3000
CMD ["yarn", "start"]