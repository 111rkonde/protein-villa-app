# 🏗️ Terraform Production Configuration & Deployment Guide

This guide explains **every file and configuration parameter** that must be customized before applying Terraform infrastructure to a **Live Production Environment** on AWS.

---

## 📋 Production Readiness Checklist: Files to Modify

| # | File Path | Parameter / Block | Placeholder / Default | What to Change for Production | Why It Matters |
| :- | :--- | :--- | :--- | :--- | :--- |
| **1** | [`terraform/main.tf`](../terraform/main.tf#L10-L16) | `backend "s3"` | `bucket = "protein-villa-terraform-state"`<br/>`dynamodb_table = "..."` | Replace with your unique S3 state bucket name and DynamoDB lock table name | Ensures safe team collaboration and state file locking across deployments |
| **2** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L4-L6) | `aws_region`<br/>`project_name` | `"us-east-1"`<br/>`"protein-villa-prod"` | Set to your primary AWS target region (e.g. `ap-south-1`, `us-east-1`) and custom project name | Regional compliance, latency optimization, and billing categorization |
| **3** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L8-L11) | `vpc_cidr`<br/>`availability_zone_count` | `"10.2.0.0/16"`<br/>`3` | Ensure VPC CIDR does not overlap with existing corporate networks/VPNs | Prevents routing collisions across multi-VPC or DirectConnect peering |
| **4** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L14-L18) | `eks_node_group_size`<br/>`eks_min_nodes`<br/>`eks_max_nodes` | `t3.large`<br/>`min: 3, max: 10` | Size nodes based on expected traffic (e.g. `t3.xlarge` or `m6i.large` for high throughput) | Ensures cluster has adequate CPU/Memory to handle pod auto-scaling |
| **5** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L22-L24) | `database_name`<br/>`database_username` | `"protein_villa_prod"`<br/>`"prod_admin"` | Set your production database name and master administrative username | Database access segregation |
| **6** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L32) | `rds_kms_key_id` | `"arn:aws:kms:us-east-1:123456789012:key/..."` | Replace with your AWS KMS Key ARN (or leave `""` to use AWS default RDS encryption key) | Enforces HIPAA/SOC2 compliance with Customer Managed Encryption Keys |
| **7** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L52) | `alb_certificate_arn` | `"arn:aws:acm:us-east-1:123456789012:certificate/..."` | Replace with the ACM Certificate ARN for `devopswithyogesh.online` / `*.devopswithyogesh.online` | Enables HTTPS SSL termination on the Application Load Balancer |
| **8** | [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars#L48-L49) | `enable_waf`<br/>`cloudfront_price_class` | `true`<br/>`"PriceClass_All"` | Keep `enable_waf = true` and select `PriceClass_All` or `PriceClass_200` | DDoS protection and global edge CDN performance |

---

## 🔍 Detailed File-by-File Walkthrough

---

### 1. `terraform/main.tf` — S3 Backend Remote State Setup

Before running Terraform in production, create an S3 bucket and DynamoDB table for remote state locking so multiple engineers do not corrupt the state file.

#### **A. Create S3 Bucket and DynamoDB Table via AWS CLI:**
```bash
# 1. Create S3 State Bucket
aws s3api create-bucket \
  --bucket devopswithyogesh-terraform-state-prod \
  --region us-east-1

# 2. Enable S3 Bucket Versioning
aws s3api put-bucket-versioning \
  --bucket devopswithyogesh-terraform-state-prod \
  --versioning-configuration Status=Enabled

# 3. Enable S3 Default Encryption
aws s3api put-bucket-encryption \
  --bucket devopswithyogesh-terraform-state-prod \
  --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# 4. Create DynamoDB Lock Table
aws dynamodb create-table \
  --table-name devopswithyogesh-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

#### **B. Update `terraform/main.tf`:**
```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "devopswithyogesh-terraform-state-prod"
    key            = "protein-villa/production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "devopswithyogesh-terraform-locks"
  }
}
```

---

### 2. `terraform/environments/prod.tfvars` — Production Variables

Update [`terraform/environments/prod.tfvars`](../terraform/environments/prod.tfvars) with your production credentials, ARNs, and domain settings:

```hcl
# ==========================================
# 1. General & Region Settings
# ==========================================
environment  = "prod"
aws_region   = "us-east-1"
project_name = "protein-villa-prod"

# ==========================================
# 2. VPC Networking (Multi-AZ)
# ==========================================
vpc_cidr                = "10.2.0.0/16"
availability_zone_count = 3
enable_nat_gateway      = true
single_nat_gateway      = false # Multi-AZ NAT Gateways for High Availability

# ==========================================
# 3. EKS Production Kubernetes Cluster
# ==========================================
eks_cluster_version       = "1.30"
eks_node_group_size      = "t3.large"
eks_min_nodes            = 3
eks_max_nodes            = 10
eks_desired_nodes        = 3
enable_cluster_autoscaler = true

# ==========================================
# 4. Amazon RDS PostgreSQL (High Availability)
# ==========================================
database_name               = "protein_villa_prod"
database_username           = "pv_prod_admin"
database_port               = 5432
rds_allocated_storage       = 100
rds_max_allocated_storage   = 500
rds_instance_class          = "db.r6g.large"
rds_engine_version          = "16.2"
rds_multi_az               = true  # Automatic standby replica in secondary AZ
rds_backup_retention_period = 30    # 30-day automated point-in-time recovery
rds_deletion_protection     = true  # Prevents accidental database deletion
rds_kms_key_id              = ""    # Set AWS KMS ARN or leave empty for default encryption

# ==========================================
# 5. ElastiCache Redis (Multi-AZ Replication)
# ==========================================
redis_cluster_id         = "pv-prod-redis"
redis_node_type          = "cache.r6g.large"
redis_num_cache_nodes    = 3
redis_engine_version     = "7.0"
redis_automatic_failover = true
redis_multi_az           = true

# ==========================================
# 6. S3 Media & Backup Storage
# ==========================================
s3_bucket_prefix         = "protein-villa-prod"
s3_enable_versioning     = true
s3_enable_lifecycle_rule = true

# ==========================================
# 7. CloudFront Global CDN & AWS WAF
# ==========================================
enable_waf             = true
cloudfront_price_class = "PriceClass_All"

# ==========================================
# 8. Application Load Balancer & SSL (ACM)
# ==========================================
# Request this certificate in AWS Certificate Manager for your domain:
alb_certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_UUID"
alb_enable_https    = true
```

---

## 🔒 Security Best Practices for Production

1. **Never Commit Passwords to Git:**
   * The database master user password is automatically managed by **AWS Secrets Manager** (`manage_master_user_password = true` in [`modules/rds/main.tf`](../terraform/modules/rds/main.tf)).
2. **Deletion Protection:**
   * `rds_deletion_protection = true` prevents anyone from deleting the database via Terraform or AWS Console without explicitly disabling protection first.
3. **Multi-AZ Resilience:**
   * `rds_multi_az = true` ensures that if one AWS availability zone experiences an outage, RDS fails over to the standby instance in under 60 seconds with zero data loss.
4. **NAT Gateway High Availability:**
   * `single_nat_gateway = false` creates a dedicated NAT Gateway in every Availability Zone, eliminating single points of failure.

---

## 🚀 Step-by-Step Production Deployment Workflow

### **Step 1: Initialize Terraform with Remote S3 Backend**
```bash
cd terraform
terraform init
```

### **Step 2: Run a Dry-Run Plan for Production**
```bash
terraform plan -var-file=environments/prod.tfvars -out=prod.tfplan
```
*Review the resource additions and verify no unintended deletions exist.*

### **Step 3: Apply the Production Infrastructure**
```bash
terraform apply prod.tfplan
```

### **Step 4: Retrieve Production Outputs**
```bash
terraform output
```
Key outputs to save:
* `eks_cluster_endpoint`
* `rds_endpoint`
* `redis_endpoint`
* `alb_dns_name`
* `cloudfront_domain_name`

---

## 🔄 How to Roll Back or Update in Production

* **Update Configuration (Zero Downtime):**
  Edit `prod.tfvars` (e.g. increase `eks_max_nodes` to 15) and run:
  ```bash
  terraform apply -var-file=environments/prod.tfvars
  ```
* **State Drift Detection:**
  ```bash
  terraform plan -refresh-only -var-file=environments/prod.tfvars
  ```
