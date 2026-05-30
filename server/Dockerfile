FROM node:20-alpine

WORKDIR /app

# Copy package dependencies and prisma schema first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client (needed before starting the app)
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
