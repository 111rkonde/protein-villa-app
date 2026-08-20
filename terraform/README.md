# Terraform Infrastructure as Code

This directory contains Terraform configurations for deploying Protein Villa across multiple environments (dev, test, production) on AWS.

## Prerequisites

- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- AWS account with sufficient permissions

## Directory Structure

```
terraform/
├── main.tf                 # Main Terraform configuration
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── environments/           # Environment-specific variables
│   ├── dev.tfvars
│   ├── test.tfvars
│   └── prod.tfvars
└── modules/                # Reusable Terraform modules
    ├── vpc/               # VPC networking
    ├── eks/               # Kubernetes cluster
    ├── rds/               # PostgreSQL database
    ├── elasticache/       # Redis cache
    ├── s3/                # S3 storage
    ├── cloudfront/        # CDN
    ├── alb/               # Application Load Balancer
    └── security_groups/   # Security groups
```

## Quick Start

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Select Environment

Choose the environment you want to deploy to:

```bash
# Development
terraform plan -var-file=environments/dev.tfvars

# Test
terraform plan -var-file=environments/test.tfvars

# Production
terraform plan -var-file=environments/prod.tfvars
```

### 3. Apply Changes

```bash
terraform apply -var-file=environments/dev.tfvars
```

> 📖 **Production Checklist & Configuration Guide:** See [`../docs/10-TERRAFORM-PRODUCTION-GUIDE.md`](../docs/10-TERRAFORM-PRODUCTION-GUIDE.md) for a complete file-by-file checklist of values to change before applying to live production.

## Environment Configurations

### Development (dev)
- **VPC**: 10.0.0.0/16, 2 AZs
- **EKS**: t3.medium, 1-3 nodes
- **RDS**: db.t3.micro, 20GB storage, single AZ
- **Redis**: cache.t3.micro, 1 node
- **S3**: No versioning, no lifecycle rules
- **CloudFront**: PriceClass_100, no WAF
- **ALB**: HTTP only

### Test (test)
- **VPC**: 10.1.0.0/16, 2 AZs
- **EKS**: t3.medium, 2-4 nodes
- **RDS**: db.t3.small, 20GB storage, single AZ
- **Redis**: cache.t3.micro, 1 node
- **S3**: Versioning enabled, lifecycle rules
- **CloudFront**: PriceClass_100, no WAF
- **ALB**: HTTP only

### Production (prod)
- **VPC**: 10.2.0.0/16, 3 AZs
- **EKS**: t3.large, 3-10 nodes, autoscaler enabled
- **RDS**: db.r6g.large, 100GB storage, multi-AZ, encryption
- **Redis**: cache.r6g.large, 3 nodes, multi-AZ, failover
- **S3**: Versioning enabled, lifecycle rules
- **CloudFront**: PriceClass_All, WAF enabled
- **ALB**: HTTPS with SSL certificate

## Modules

### VPC Module
Creates VPC, public/private subnets, internet gateway, NAT gateway, and route tables.

### EKS Module
Provisions EKS cluster, node groups, IAM roles, and essential add-ons (VPC CNI, CoreDNS, Kube-proxy, EBS CSI driver).

### RDS Module
Deploys PostgreSQL database with configurable instance types, storage, backup, and encryption options.

### ElastiCache Module
Creates Redis cluster with automatic failover and encryption support.

### S3 Module
Provisions S3 buckets with versioning, lifecycle rules, and CloudFront integration.

### CloudFront Module
Sets up CDN distribution with SSL support and WAF integration.

### ALB Module
Creates Application Load Balancer with HTTP/HTTPS listeners and target groups.

### Security Groups Module
Defines security groups for backend, frontend, and database components.

## State Management

Terraform state is stored in S3 with DynamoDB for locking:

- **S3 Bucket**: protein-villa-terraform-state
- **DynamoDB Table**: protein-villa-terraform-locks
- **Region**: us-east-1

## Outputs

After deployment, Terraform outputs important values:

- VPC ID and CIDR
- Subnet IDs
- EKS cluster endpoint and security group
- RDS endpoint and security group
- Redis endpoint
- S3 bucket name and ARN
- CloudFront distribution ID and domain name
- ALB DNS name and security group

## Cleanup

To destroy infrastructure:

```bash
terraform destroy -var-file=environments/dev.tfvars
```

## Security Notes

- Database passwords are marked as sensitive in outputs
- RDS and Redis are deployed in private subnets
- Security groups follow least privilege principle
- Production environment uses encryption and multi-AZ deployments
- S3 buckets block public access by default

## Cost Optimization

- Development environment uses minimal resources
- NAT gateway is single-AZ in dev/test, multi-AZ in prod
- S3 lifecycle rules move old versions to cheaper storage
- CloudFront price classes control edge location costs

## Troubleshooting

### State Lock Issues
If you encounter state lock issues, you can force unlock:
```bash
terraform force-unlock <LOCK_ID>
```

### Module Version Conflicts
Ensure all modules use compatible Terraform and provider versions.

### AWS Credentials
Verify AWS CLI is configured with correct credentials:
```bash
aws sts get-caller-identity
```

## Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [RDS PostgreSQL Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
