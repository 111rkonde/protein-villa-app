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

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "cluster_id" {
  description = "ElastiCache cluster ID"
  type        = string
}

variable "node_type" {
  description = "Redis node type"
  type        = string
}

variable "num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
}

variable "engine_version" {
  description = "Redis engine version"
  type        = string
}

variable "automatic_failover_enabled" {
  description = "Enable automatic failover"
  type        = bool
}

variable "multi_az_enabled" {
  description = "Enable Multi-AZ for Redis"
  type        = bool
}
