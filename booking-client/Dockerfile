# pull official base image
FROM node:18-alpine AS development

# set working directory
WORKDIR /usr/src/app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . .

# no-root user runs the app 
RUN chown -R node /usr/src/app
USER node

# start app
CMD ["npm", "start"]