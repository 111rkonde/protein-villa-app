variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "bucket_prefix" {
  description = "S3 bucket name prefix"
  type        = string
}

variable "enable_versioning" {
  description = "Enable S3 versioning"
  type        = bool
}

variable "enable_lifecycle_rule" {
  description = "Enable S3 lifecycle rule"
  type        = bool
}

variable "origin_access_identity_arn" {
  description = "CloudFront Origin Access Identity ARN"
  type        = string
  default     = ""
}
