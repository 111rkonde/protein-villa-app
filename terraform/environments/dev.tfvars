# Development Environment Variables

environment  = "dev"
aws_region   = "us-east-1"
project_name = "protein-villa-dev"

# VPC Configuration
vpc_cidr                = "10.0.0.0/16"
availability_zone_count = 2
enable_nat_gateway      = true
single_nat_gateway      = true

# EKS Configuration
eks_cluster_version       = "1.28"
eks_node_group_size       = "t3.medium"
eks_min_nodes             = 1
eks_max_nodes             = 3
eks_desired_nodes         = 1
enable_cluster_autoscaler = true

# RDS Configuration
database_name               = "protein_villa_dev"
database_username           = "dev_admin"
database_port               = 5432
rds_allocated_storage       = 20
rds_max_allocated_storage   = 50
rds_instance_class          = "db.t3.micro"
rds_engine_version          = "15.4"
rds_multi_az                = false
rds_backup_retention_period = 1
rds_deletion_protection     = false
rds_kms_key_id              = ""

# Redis Configuration
redis_cluster_id         = "protein-villa-dev-redis"
redis_node_type          = "cache.t3.micro"
redis_num_cache_nodes    = 1
redis_engine_version     = "7.0"
redis_automatic_failover = false
redis_multi_az           = false

# S3 Configuration
s3_bucket_prefix         = "protein-villa-dev"
s3_enable_versioning     = false
s3_enable_lifecycle_rule = false

# CloudFront Configuration
enable_waf             = false
cloudfront_price_class = "PriceClass_100"

# ALB Configuration
alb_certificate_arn = ""
alb_enable_https    = false
