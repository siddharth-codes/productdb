FROM node:alpine
WORKDIR /usr/src/app 
#initializee the workdir in host system linux
COPY package*.json .
#copying pakage*.json file from the folder so to isntall all dependecies
RUN npm ci
#npm ci will install all the dependencies of the required version
COPY . .
#copy files from our project folder..
CMD ["npm", "start"]
#above line is  ame as npm startnp