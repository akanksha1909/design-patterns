# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the service source code including db.js
COPY . .

# Start the app
CMD ["npm", "start"]
