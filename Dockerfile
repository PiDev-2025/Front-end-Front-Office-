# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copier le fichier .env
COPY .env* ./
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cleanup
RUN rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
