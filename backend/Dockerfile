FROM node:18-alpine

WORKDIR /app

# Install required system dependencies for canvas and other native modules
RUN apk add --no-cache \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    curl

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application in development mode
CMD ["npm", "run", "dev"]