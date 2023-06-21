# Set the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the entire project to the working directory
COPY . .

# Install dependencies
RUN yarn install

# Specify the command to run the application
CMD ["/usr/local/bin/yarn", "run", "dev", "--host", "0.0.0.0"]
