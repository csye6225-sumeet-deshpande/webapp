packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}


variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "aws_profile" {
  type    = string
  default = "dev"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}


source "amazon-ebs" "debian" {
  ami_name      = "Ami_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  source_ami    = "${var.source_ami}"
  instance_type = "${var.instance_type}"
  region        = "${var.aws_region}"
  profile       = "${var.aws_profile}"
  ssh_username  = "${var.ssh_username}"
  ami_users = [
    "730146561444",
    "933464024683",
  ]
}

build {
  sources = [
    "source.amazon-ebs.debian"
  ]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "~/webapp.zip"
  }

  provisioner "shell" {
    scripts = [
      "./setup.sh",
    ]
  }
}

