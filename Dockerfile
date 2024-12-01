# Use an official Node.js image
FROM node:20.15.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application runs on
EXPOSE 5000

# Use nodemon for development or node for production
CMD ["npm", "start"]
