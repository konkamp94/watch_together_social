#!/bin/bash

# Path to the update script
UPDATE_SCRIPT="/usr/local/bin/update_cloudflare_ips.sh"

# Run the update script to ensure Nginx has the latest configuration
$UPDATE_SCRIPT

# Start cron daemon
cron

# Start Nginx in the foreground
nginx -g 'daemon off;'