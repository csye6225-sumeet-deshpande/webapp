#!/bin/bash

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y unzip
# Install PostgreSQL and related packages
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v
echo "+-----------------------------------------------------------------------------------------------------------------------------------------+"
echo "|                                                                                                                                         |"
echo "|                                                    printing value                                                   |"
echo "|                                                                                                                                         |"
echo "+-----------------------------------------------------------------------------------------------------------------------------------------+"

ls 

echo "alter postgres user password"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Kothrud@2021';"

sudo mkdir webapp
sudo unzip webapp.zip -d webapp
cd webapp
sudo npm install
sudo apt-get remove -y git



# Create a non-admin user
sudo useradd -m sumeet
sudo groupadd webappgroup
 
# Add sumeet and admin to the webappgroup
sudo usermod -aG webappgroup sumeet
sudo usermod -aG webappgroup admin
 
# Set ownership and permissions for sumeet's home directory
sudo chown -R sumeet:webappgroup /home/sumeet
sudo chmod -R 750 /home/sumeet
 

sudo chown sumeet:webappgroup /home/admin/webapp/index.js
sudo chmod 750 /home/admin/webapp/index.js
 
# Add sumeet to the systemd-journal group
sudo usermod -aG systemd-journal sumeet
 
sudo chmod 644 /home/admin/webapp/.env
 
# Create the log file and set ownership and permissions
sudo touch /var/log/webapp.log
sudo chown sumeet:webappgroup /var/log/webapp.log
sudo chmod 644 /var/log/webapp.log
 
sudo chmod 600 /home/admin/webapp/.env