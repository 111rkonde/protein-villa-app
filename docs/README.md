# 📚 Protein Villa — Documentation Center

Welcome to the comprehensive documentation suite for **Protein Villa**, a production-style 3-tier e-commerce and sports nutrition technology web application.

---

## 📑 Documentation Index

| Guide | Description | Target Audience |
| :--- | :--- | :--- |
| [**1. System Architecture**](./01-ARCHITECTURE.md) | High-level 3-tier design, layer interactions, and security models | Architects, Developers |
| [**2. Local Development Guide**](./02-LOCAL-DEVELOPMENT.md) | Step-by-step guide for local setup, running dev servers, and live reload | Developers |
| [**3. Docker & Compose Deployment**](./03-DOCKER-DEPLOYMENT.md) | Multi-stage Docker builds, container orchestration, and networking | DevOps, Developers |
| [**4. Kubernetes (K8s) Deployment**](./04-KUBERNETES-DEPLOYMENT.md) | Complete K8s rollout with Pods, Deployments, HPA, Ingress, and Secrets | DevOps, SREs |
| [**5. Database & Seeding Guide**](./05-DATABASE-AND-SEEDING.md) | Prisma ORM schema, migrations, SQLite/PostgreSQL setup, and seed data | Database Engineers |
| [**6. REST API Reference**](./06-API-REFERENCE.md) | 40+ endpoints with request/response schemas and JWT authentication | Frontend, API Clients |
| [**7. Testing & CI/CD Pipeline**](./07-TESTING-AND-CI-CD.md) | Automated Vitest test suites, build validation, and Jenkins/GitHub Actions | QA, DevOps |
| [**8. AWS Cloud Deployment**](./08-AWS-DEPLOYMENT.md) | Production deployment on AWS EKS, ECS Fargate, RDS PostgreSQL, CloudFront, ECR | Cloud Engineers, DevOps |
| [**9. Request Traffic Flow & Domain Routing**](./09-REQUEST-TRAFFIC-FLOW.md) | How traffic travels from `devopswithyogesh.online` to Services & Pods | Network, DevOps, Architects |

---

## ⚡ Quick Navigation

* **Application Name:** Protein Villa
* **Tagline:** *"Fuel Your Goals. Build Your Best Self."*
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Three.js / React Three Fiber
* **Backend:** Node.js, Express.js, TypeScript, Zod, JWT
* **Database:** Prisma ORM, SQLite (local) / PostgreSQL (production ready)
* **DevOps:** Docker Multi-stage, Docker Compose, Kubernetes manifests (`k8s/`)

---

## 🔑 Default Demo Credentials

| Account Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Athlete User** | `user@proteinvilla.demo` | `User@12345` | Product catalog, cart, checkout, daily tracker, profile |
| **Shop Owner / Admin** | `owner@proteinvilla.demo` | `Owner@12345` | Full admin console (`/admin`), product CRUD, stock, orders |
