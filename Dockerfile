FROM nginx:alpine
COPY index.html /usr/share/nginx/html
COPY ./assets /usr/share/nginx/html/assets
COPY ./configs /usr/share/nginx/html/configs
COPY ./css /usr/share/nginx/html/css
COPY ./data /usr/share/nginx/html/data
COPY ./html /usr/share/nginx/html/html
COPY ./js /usr/share/nginx/html/js

# Copy the EntryPoint
COPY ./entryPoint.sh /
RUN chmod +x entryPoint.sh

ENTRYPOINT ["./entryPoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
