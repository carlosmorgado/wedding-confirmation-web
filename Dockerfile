FROM node:alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/wedding-confirmation-web/browser /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
