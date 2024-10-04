# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Development Stage
FROM base AS development

# Expose port 3000 for development server
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev"]