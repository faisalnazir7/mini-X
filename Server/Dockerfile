# Use the official Node.js image as the base image
FROM node:18

# Create a working directory for your app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the TypeScript code (check it have a tsconfig.json file)
RUN npm run build

# Exposeing the port that the app will listen on
EXPOSE 8080

# Start compiled TypeScript app
CMD [ "node", "dist/server.js" ]
