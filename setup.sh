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
