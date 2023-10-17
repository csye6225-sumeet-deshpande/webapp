// packer {
//   required_plugins {
//     amazon = {
//       version = ">= 1.0.0"
//       source  = "github.com/hashicorp/amazon"
//     }
//   }
// }

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

variable "owners" {
  type    = string
  default = "amazon"
}
variable "os_name" {
  type    = string
  default = "debian-12-amd64-*"
}

variable "os_root_type" {
  type    = string
  default = "ebs"
}
variable "vr_type" {
  type    = string
  default = "hvm"
}

source "amazon-ebs" "debian" {
  ami_name = "Ami_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  source_ami_filter {
    filters = {
      name                = "${var.os_name}"
      root-device-type    = "${var.os_root_type}"
      virtualization-type = "${var.vr_type}"
    }
    most_recent = true
    owners      = ["${var.owners}"]
  }
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

