# Node.js Backend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm install -g typescript
RUN npm run build || tsc

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/models ./models
COPY --from=builder /app/controller ./controller
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/services ./services
COPY --from=builder /app/server.ts ./server.ts

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "server.ts"]
