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

variable "database_name" {
  description = "Database name"
  type        = string
}

variable "database_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
}

variable "database_port" {
  description = "Database port"
  type        = number
}

variable "allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
}

variable "max_allocated_storage" {
  description = "RDS maximum allocated storage in GB"
  type        = number
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
}

variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
}

variable "kms_key_id" {
  description = "KMS key ID for RDS encryption"
  type        = string
}
