# Set the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the entire project to the working directory
COPY . .

RUN yarn install

# Specify the command to run the application
CMD ["yarn", "dev", "--host", "0.0.0.0"]


