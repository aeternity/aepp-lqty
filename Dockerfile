# Set the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the entire project to the working directory
COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000

# Specify the command to run the application
CMD ["npm", "run", "dev"]

