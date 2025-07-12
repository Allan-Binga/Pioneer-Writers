# -------------------
# Stage 1: Builder
# -------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install system tools needed by Prisma
RUN apk add --no-cache openssl

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy full app source code (make sure prisma is included)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# -------------------
# Stage 2: Final image
# -------------------
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copy only what's needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app ./

EXPOSE 6100

CMD ["npm", "start"]
