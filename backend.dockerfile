FROM node:22.14-alpine as builder

# Set the current working directory inside the container
WORKDIR /app/backend

# Install dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Copy backend and common source code
COPY /backend ./
COPY /common ../common

RUN npm run build

FROM node:22.14-alpine as runner
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/backend/dist ./

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "backend/src/index.js"]
