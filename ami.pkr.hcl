// packer {
//   required_plugins {
//     amazon = {
//       version = ">= 1.0.0"
//       source  = "github.com/hashicorp/amazon"
//     }
//   }
// }


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

variable "os_name" {
  type    = string
  default = "debian-12-amd64-*"
}

variable "os_root_type" {
  type    = string
  default = "ebs"
}

variable "os_vr" {
  type    = string
  default = "hvm"
}

variable "dev_id" {
  type    = string
  default = "730146561444"
}

variable "demo_id" {
  type    = string
  default = "933464024683"
}

variable "device_name" {
  type    = string
  default = "/dev/xvda"
}

variable "volume_size" {
  type    = string
  default = "25"
}

variable "volume_type" {
  type    = string
  default = "gp2"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "AWS_ACCESS_KEY_ID" {
  type    = string
  default = "AKIA2UABALWSAMFCJKE5"
}

variable "AWS_SECRET_ACCESS_KEY" {
  type    = string
  default = "VlxZp2u5nYjNh0Uxox25cqlB8yqjyAmpiwiZkZWH"
}



source "amazon-ebs" "debian" {
  ami_name = "Ami_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  source_ami_filter {
    filters = {
      name                = "${var.os_name}"
      root-device-type    = "${var.os_root_type}"
      virtualization-type = "${var.os_vr}"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  instance_type = "${var.instance_type}"
  region        = "${var.aws_region}"
  profile       = "${var.aws_profile}"
  ssh_username  = "${var.ssh_username}"
  ami_users = [
    "${var.dev_id}",
    "${var.demo_id}",
  ]
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "${var.device_name}"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
  }
}

build {
  sources = [
    "source.amazon-ebs.debian"
  ]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "script/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    scripts = [
      "./setup.sh",
      "script/cloudwatch.sh",
      "script/systemd_install.sh",
    ]
    environment_vars = [
      "AWS_ACCESS_KEY_ID=${var.AWS_ACCESS_KEY_ID}",
      "AWS_SECRET_ACCESS_KEY=${var.AWS_SECRET_ACCESS_KEY}",
    ]
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}


