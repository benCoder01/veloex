FROM node:12.6.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY wait-for-it.sh wait-for-it.sh
COPY .env .env
COPY ./src ./src


RUN npm install -g nodemon


EXPOSE 3000
RUN ["chmod", "+x", "wait-for-it.sh"]
CMD ["./wait-for-it.sh", "mariadb:3306", "--", "nodemon", "./src/index.js"]
# CMD [ "node", "index.js" ]