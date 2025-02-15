# Base stage for dependency caching
FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# copy package.json AND package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Development Stage
FROM base AS development

# Expose port 5173 (Vite default for development)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

# Production Stage
FROM base AS production

# Build the application
RUN npm run build

# Expose port 5173 (Vite default for production)
EXPOSE 4173

# Start the production server
CMD ["npm", "run", "preview"]
