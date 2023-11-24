#!/bin/bash
sudo apt-get install -y awscli
# AWS CLI configuration
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" --profile dev
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY" --profile dev
aws configure set region "us-east-1" --profile dev

sudo cp -r .aws /opt/csye6225/


sudo chown -R csye6225:csye6225 /opt/csye6225/.aws