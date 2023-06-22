# Set the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files to the working directory
COPY . .

# Expose the port that your Vue application is running on
EXPOSE 3000

# Start the Vue application
CMD ["npm", "run", "dev"]