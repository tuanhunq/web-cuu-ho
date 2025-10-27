# Stage 1: Build
FROM node:16-alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Production
FROM node:16-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]