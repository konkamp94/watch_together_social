FROM nginx:latest

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the update script and entrypoint script
COPY update_cloudflare_ips.sh /usr/local/bin/update_cloudflare_ips.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make scripts executable
RUN chmod +x /usr/local/bin/update_cloudflare_ips.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Install cron
RUN apt-get update && apt-get install -y cron

# Create cron job file
RUN echo "0 0 * * * /usr/local/bin/update_cloudflare_ips.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/update-cloudflare-ips

# Apply cron job
RUN crontab /etc/cron.d/update-cloudflare-ips

# Use the custom entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
