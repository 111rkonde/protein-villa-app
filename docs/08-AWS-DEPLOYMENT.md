# ☁️ AWS Cloud Step-by-Step Production Deployment Guide

This document is a practical, command-by-command tutorial for deploying the **Protein Villa** 3-tier application to **Amazon Web Services (AWS)** from scratch.

---

## 📋 Prerequisites & Tools Setup

Ensure you have the following CLI tools installed on your local machine:
* [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [eksctl](https://eksctl.io/installation/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Helm v3](https://helm.sh/docs/intro/install/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Authenticate with AWS CLI
```bash
aws configure
```
Enter your AWS credentials when prompted:
* **AWS Access Key ID:** `AKIAIOSFODNN7EXAMPLE`
* **AWS Secret Access Key:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
* **Default region name:** `us-east-1`
* **Default output format:** `json`

Verify your AWS identity:
```bash
aws sts get-caller-identity
```

---

## 🚀 Phase 1: Create Amazon ECR Repositories & Push Images

### Step 1: Export Environment Variables
```bash
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
```

### Step 2: Create ECR Repositories
```bash
# Create Backend ECR Repository
aws ecr create-repository \
  --repository-name protein-villa-backend \
  --region ${AWS_REGION} \
  --image-scanning-configuration scanOnPush=true

# Create Frontend ECR Repository
aws ecr create-repository \
  --repository-name protein-villa-frontend \
  --region ${AWS_REGION} \
  --image-scanning-configuration scanOnPush=true
```

### Step 3: Authenticate Local Docker with Amazon ECR
```bash
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
```

### Step 4: Build & Tag Multi-Stage Docker Images
```bash
# 1. Build and push Backend image
docker build -t ${ECR_REGISTRY}/protein-villa-backend:v1.0.0 ./backend
docker tag ${ECR_REGISTRY}/protein-villa-backend:v1.0.0 ${ECR_REGISTRY}/protein-villa-backend:latest
docker push ${ECR_REGISTRY}/protein-villa-backend:latest
docker push ${ECR_REGISTRY}/protein-villa-backend:v1.0.0

# 2. Build and push Frontend image
docker build -t ${ECR_REGISTRY}/protein-villa-frontend:v1.0.0 ./frontend
docker tag ${ECR_REGISTRY}/protein-villa-frontend:v1.0.0 ${ECR_REGISTRY}/protein-villa-frontend:latest
docker push ${ECR_REGISTRY}/protein-villa-frontend:latest
docker push ${ECR_REGISTRY}/protein-villa-frontend:v1.0.0
```

---

## 🗄️ Phase 2: Provision Amazon RDS PostgreSQL Database

### Step 1: Create a Security Group for RDS
```bash
# 1. Get default VPC ID (or your custom VPC)
export VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

# 2. Create Security Group for database
export DB_SG_ID=$(aws ec2 create-security-group \
  --group-name protein-villa-rds-sg \
  --description "Security group for Protein Villa PostgreSQL RDS" \
  --vpc-id ${VPC_ID} \
  --query "GroupId" --output text)

# 3. Allow inbound PostgreSQL traffic on port 5432 from within the VPC
aws ec2 authorize-security-group-ingress \
  --group-id ${DB_SG_ID} \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/16
```

### Step 2: Create Amazon RDS PostgreSQL Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier proteinvilla-prod-db \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16.2 \
  --allocated-storage 20 \
  --master-username pv_admin \
  --master-user-password "ProteinVillaSecure2026Password!" \
  --vpc-security-group-ids ${DB_SG_ID} \
  --backup-retention-period 7 \
  --no-publicly-accessible \
  --region ${AWS_REGION}
```

Wait until the database status is `available`:
```bash
aws rds wait db-instance-available --db-instance-identifier proteinvilla-prod-db
```

### Step 3: Get Database Endpoint
```bash
export DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier proteinvilla-prod-db \
  --query "DBInstances[0].Endpoint.Address" --output text)

echo "Database Endpoint: ${DB_ENDPOINT}"
```

Construct your production database connection string:
```
postgresql://pv_admin:ProteinVillaSecure2026Password!@${DB_ENDPOINT}:5432/postgres?schema=public&sslmode=require
```

---

## ☸️ Phase 3: Create Amazon EKS Cluster

### Step 1: Provision Cluster with `eksctl`
```bash
eksctl create cluster \
  --name protein-villa-cluster \
  --region ${AWS_REGION} \
  --version 1.30 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 6 \
  --managed \
  --with-oidc
```

### Step 2: Configure `kubectl` Context
```bash
aws eks update-kubeconfig --name protein-villa-cluster --region ${AWS_REGION}

# Verify cluster connection
kubectl get nodes
```

---

## ⚙️ Phase 4: Deploy Kubernetes Manifests to EKS

### Step 1: Update `k8s/secrets.yaml`
Open [`k8s/secrets.yaml`](../k8s/secrets.yaml) and replace `DATABASE_URL` with your RDS endpoint:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: protein-villa-secrets
  namespace: protein-villa
type: Opaque
stringData:
  DATABASE_URL: "postgresql://pv_admin:ProteinVillaSecure2026Password!@proteinvilla-prod-db.c123456789.us-east-1.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require"
  JWT_SECRET: "protein-villa-super-secure-production-jwt-token-2026-secret-key"
  JWT_EXPIRES_IN: "7d"
  ADMIN_EMAIL: "owner@proteinvilla.demo"
  ADMIN_DEFAULT_PASSWORD: "Owner@12345"
```

### Step 2: Update Image URIs in Deployment Files
Update `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` to point to your ECR registry:
* Backend Image: `<YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/protein-villa-backend:latest`
* Frontend Image: `<YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/protein-villa-frontend:latest`

### Step 3: Apply All Manifests with Kustomize
```bash
kubectl apply -k k8s/
```

### Step 4: Install AWS Load Balancer Controller
```bash
# 1. Create IAM Policy for AWS Load Balancer Controller
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json

# 2. Create IAM Service Account
eksctl create iamserviceaccount \
  --cluster=protein-villa-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

# 3. Install via Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=protein-villa-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

---

## 🗃️ Phase 5: Run Database Migrations & Initial Seed Data

Execute database schema migration and populate products directly inside a running backend pod:

```bash
# 1. Identify the running backend pod
export BACKEND_POD=$(kubectl get pods -n protein-villa -l app=protein-villa-backend -o jsonpath='{.items[0].metadata.name}')

# 2. Push database schema to RDS PostgreSQL
kubectl exec -it ${BACKEND_POD} -n protein-villa -- npx prisma db push

# 3. Seed demo products, brands, categories, coupons, and demo accounts
kubectl exec -it ${BACKEND_POD} -n protein-villa -- npm run seed
```

---

## 🌐 Phase 6: Domain, SSL Certificate & CloudFront CDN

### Step 1: Request Free SSL/TLS Certificate with AWS ACM
```bash
aws acm request-certificate \
  --domain-name proteinvilla.com \
  --subject-alternative-names "*.proteinvilla.com" \
  --validation-method DNS \
  --region us-east-1
```
*Go to Route 53 and create the CNAME validation records automatically in the AWS Console.*

### Step 2: Get Application Load Balancer DNS Name
```bash
kubectl get ingress -n protein-villa
```
Copy the `ADDRESS` field (*e.g. `k8s-proteinv-proteinv-1234567890.us-east-1.elb.amazonaws.com`*).

### Step 3: Create Amazon CloudFront CDN Distribution
1. Navigate to **CloudFront** ➔ **Create Distribution**.
2. **Origin Domain:** Enter your ALB DNS Name.
3. **Default Behavior (`/*`):**
   * Viewer Protocol Policy: `Redirect HTTP to HTTPS`.
   * Allowed HTTP Methods: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`.
   * Cache Policy: `CachingOptimized`.
4. **Second Behavior (`/api/*`):**
   * Path Pattern: `/api/*`.
   * Cache Policy: `CachingDisabled` (all API requests pass through with 0 TTL).
   * Origin Request Policy: `AllViewerExceptHostHeader`.
5. **Custom SSL Certificate:** Attach your ACM certificate.

### Step 4: Configure Route 53 DNS Alias Record
1. In **Route 53**, select your Hosted Zone (`proteinvilla.com`).
2. Create an **A Record**:
   * **Name:** `@` (and `www`)
   * **Route traffic to:** Alias to CloudFront Distribution.

---

## 🔍 Phase 7: Verification & Health Check

### 1. Test Live Healthcheck Endpoint
```bash
curl https://proteinvilla.com/api/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-18T04:15:00.000Z",
  "uptime": 1420.5,
  "service": "Protein Villa API"
}
```

### 2. Verify Pod & Autoscaler Status
```bash
# Check pod distribution
kubectl get pods -n protein-villa -o wide

# Check HPA autoscaling
kubectl get hpa -n protein-villa
```

---

## 🔄 Phase 8: CI/CD & Zero-Downtime Application Updates

When you push new application code or features:

```bash
# 1. Build and push new image version
docker build -t ${ECR_REGISTRY}/protein-villa-backend:v1.1.0 ./backend
docker push ${ECR_REGISTRY}/protein-villa-backend:v1.1.0

# 2. Trigger zero-downtime rolling update on EKS
kubectl set image deployment/protein-villa-backend \
  backend=${ECR_REGISTRY}/protein-villa-backend:v1.1.0 \
  -n protein-villa

# 3. Monitor rollout progression
kubectl rollout status deployment/protein-villa-backend -n protein-villa

# 4. Instant rollback if an issue is detected
kubectl rollout undo deployment/protein-villa-backend -n protein-villa
```

---

## 🧹 Phase 9: Teardown & Resource Cleanup

To delete all AWS resources and prevent ongoing billing:

```bash
# 1. Delete Kubernetes resources
kubectl delete -k k8s/

# 2. Delete EKS Cluster
eksctl delete cluster --name protein-villa-cluster --region ${AWS_REGION}

# 3. Delete RDS Database
aws rds delete-db-instance \
  --db-instance-identifier proteinvilla-prod-db \
  --skip-final-snapshot

# 4. Delete ECR Repositories
aws ecr delete-repository --repository-name protein-villa-backend --force --region ${AWS_REGION}
aws ecr delete-repository --repository-name protein-villa-frontend --force --region ${AWS_REGION}
```
