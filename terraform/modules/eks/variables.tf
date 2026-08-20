variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "cluster_version" {
  description = "EKS cluster version"
  type        = string
}

variable "node_group_size" {
  description = "EKS node group instance type"
  type        = string
}

variable "min_nodes" {
  description = "Minimum number of EKS nodes"
  type        = number
}

variable "max_nodes" {
  description = "Maximum number of EKS nodes"
  type        = number
}

variable "desired_nodes" {
  description = "Desired number of EKS nodes"
  type        = number
}

variable "enable_cluster_autoscaler" {
  description = "Enable EKS cluster autoscaler"
  type        = bool
}
