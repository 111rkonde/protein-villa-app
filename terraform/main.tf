terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "protein-villa-terraform-state"
    key            = "protein-villa/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "protein-villa-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Protein Villa"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  project     = var.project_name
  vpc_cidr    = var.vpc_cidr
  az_count    = var.availability_zone_count

  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  environment        = var.environment
  project            = var.project_name
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids

  cluster_version = var.eks_cluster_version
  node_group_size = var.eks_node_group_size
  min_nodes       = var.eks_min_nodes
  max_nodes       = var.eks_max_nodes
  desired_nodes   = var.eks_desired_nodes

  enable_cluster_autoscaler = var.enable_cluster_autoscaler
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  environment        = var.environment
  project            = var.project_name
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.vpc.private_subnet_ids

  database_name     = var.database_name
  database_username = var.database_username
  database_port     = var.database_port

  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage
  instance_class        = var.rds_instance_class
  engine_version        = var.rds_engine_version

  multi_az                = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention_period
  deletion_protection     = var.rds_deletion_protection

  kms_key_id = var.rds_kms_key_id
}

# ElastiCache Module (Redis)
module "elasticache" {
  source = "./modules/elasticache"

  environment        = var.environment
  project            = var.project_name
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.vpc.private_subnet_ids

  cluster_id      = var.redis_cluster_id
  node_type       = var.redis_node_type
  num_cache_nodes = var.redis_num_cache_nodes
  engine_version  = var.redis_engine_version

  automatic_failover_enabled = var.redis_automatic_failover
  multi_az_enabled           = var.redis_multi_az
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  environment = var.environment
  project     = var.project_name

  bucket_prefix         = var.s3_bucket_prefix
  enable_versioning     = var.s3_enable_versioning
  enable_lifecycle_rule = var.s3_enable_lifecycle_rule
}

# CloudFront Module
module "cloudfront" {
  source = "./modules/cloudfront"

  environment = var.environment
  project     = var.project_name

  s3_bucket_domain_name  = module.s3.bucket_regional_domain_name
  origin_access_identity = module.s3.origin_access_identity

  enable_waf          = var.enable_waf
  price_class         = var.cloudfront_price_class
  acm_certificate_arn = var.alb_certificate_arn
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"

  environment       = var.environment
  project           = var.project_name
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids

  certificate_arn = var.alb_certificate_arn
  enable_https    = var.alb_enable_https
}

# Security Groups
module "security_groups" {
  source = "./modules/security_groups"

  environment = var.environment
  project     = var.project_name
  vpc_id      = module.vpc.vpc_id
  vpc_cidr    = var.vpc_cidr

  alb_security_group_id = module.alb.security_group_id
}
