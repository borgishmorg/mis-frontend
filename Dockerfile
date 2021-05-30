FROM node:latest as build
WORKDIR /app
COPY ./ /app/
COPY ./src/environments/environment.prod.ts /app/src/environments/environment.ts
RUN npm install
RUN npm run build


FROM nginx:latest
COPY --from=build /usr/local/app/dist/mis-frontend /usr/share/nginx/html
EXPOSE 80
