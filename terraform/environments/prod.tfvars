# Production Environment Variables

environment  = "prod"
aws_region   = "us-east-1"
project_name = "protein-villa-prod"

# VPC Configuration
vpc_cidr                = "10.2.0.0/16"
availability_zone_count = 3
enable_nat_gateway      = true
single_nat_gateway      = false

# EKS Configuration
eks_cluster_version       = "1.28"
eks_node_group_size       = "t3.large"
eks_min_nodes             = 3
eks_max_nodes             = 10
eks_desired_nodes         = 3
enable_cluster_autoscaler = true

# RDS Configuration
database_name               = "protein_villa_prod"
database_username           = "prod_admin"
database_port               = 5432
rds_allocated_storage       = 100
rds_max_allocated_storage   = 500
rds_instance_class          = "db.r6g.large"
rds_engine_version          = "15.4"
rds_multi_az                = true
rds_backup_retention_period = 30
rds_deletion_protection     = true
rds_kms_key_id              = "arn:aws:kms:us-east-1:123456789012:key/your-kms-key-id"

# Redis Configuration
redis_cluster_id         = "protein-villa-prod-redis"
redis_node_type          = "cache.r6g.large"
redis_num_cache_nodes    = 3
redis_engine_version     = "7.0"
redis_automatic_failover = true
redis_multi_az           = true

# S3 Configuration
s3_bucket_prefix         = "protein-villa-prod"
s3_enable_versioning     = true
s3_enable_lifecycle_rule = true

# CloudFront Configuration
enable_waf             = true
cloudfront_price_class = "PriceClass_All"

# ALB Configuration
alb_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/your-certificate-arn"
alb_enable_https    = true
