# Step 1: Build the Vite app
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass environment variables to Vite
ARG VITE_BACKEND_ENDPOINT
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_BACKEND_ENDPOINT=$VITE_BACKEND_ENDPOINT
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
