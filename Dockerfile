###################################################
#
# Use phusion/passenger-full as base image.
#
###################################################


FROM phusion/passenger-full:0.9.18


# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]



###########################
######## CPX-START ########
###########################


ENV NODE_ENV production
ENV PORT 8080
ENV IP 127.0.0.1
ENV HOST_NAME cpx.herokuapp.com
ENV MONGODB_URI mongodb://mongodb/cpx


# disable nginx disabler
RUN rm -f /etc/service/nginx/down

# Configure NGINX
RUN rm /etc/nginx/sites-enabled/default
ADD ./docker/docker-webapp.conf /etc/nginx/sites-enabled/webapp.conf
ADD ./docker/docker-env.conf /etc/nginx/main.d/webapp-env.conf

# Bundle app source
RUN mkdir /home/app/webapp
WORKDIR "/home/app/webapp"

# Pull down built resources
RUN git clone https://github.com/Kauabunga/cpx-dist.git .

# Print the directory
RUN ls -ltra .

# Install app dependencies
# RUN npm install --production


# Setup permissions
RUN chmod -R a+rwx /home/app/webapp


###########################
########  CPX-END  ########
###########################



# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
