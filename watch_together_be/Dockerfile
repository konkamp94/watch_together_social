# Base image
FROM node:20.11.1-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json .

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]