# Step 1: Build the Vite app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Vite app
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine

# Copy built assets from builder stage to NGINX's default HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
