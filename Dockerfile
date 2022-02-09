FROM node

WORKDIR /src
	
COPY /src/package.json .

RUN npm install
RUN npm install -g nodemon

COPY /src/. .

EXPOSE 8080

CMD ["npm", "start"]
