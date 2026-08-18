# 🧪 Testing & CI/CD Pipeline Guide

This guide describes how to run automated unit and integration tests, perform production builds, and set up continuous integration and deployment pipelines using **Jenkins** or **GitHub Actions**.

---

## 1. Automated Testing Suites

### **Backend Tests (Vitest)**
The backend includes automated integration test suites for:
* Healthcheck and system diagnostics
* Authentication workflows (Registration, Login, JWT verification)
* Role-Based Access Control (401 unauthenticated and 403 forbidden guards)
* Sports nutrition formula verification (Harris-Benedict BMR, TDEE, ISSN targets)

Run backend tests:
```bash
cd backend
npm test
```

### **Frontend Type-Checking & Production Build**
To verify all TypeScript types and produce an optimized production bundle:
```bash
cd frontend
npm run build
```

---

## 2. Jenkins CI/CD Pipeline Example (`Jenkinsfile`)

You can use the following declarative pipeline in Jenkins to build, test, and deploy Protein Villa:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/myorg'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npx prisma generate'
                    sh 'npm test'
                }
            }
        }

        stage('Frontend: Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker: Build & Push Images') {
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/protein-villa-backend:${IMAGE_TAG} ./backend"
                sh "docker build -t ${DOCKER_REGISTRY}/protein-villa-frontend:${IMAGE_TAG} ./frontend"
                
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_REGISTRY}/protein-villa-backend:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/protein-villa-frontend:${IMAGE_TAG}"
                }
            }
        }

        stage('Kubernetes: Deploy') {
            steps {
                withKubeConfig([credentialsId: 'k8s-cluster-credentials']) {
                    sh "kubectl apply -k k8s/"
                    sh "kubectl set image deployment/protein-villa-backend backend=${DOCKER_REGISTRY}/protein-villa-backend:${IMAGE_TAG} -n protein-villa"
                    sh "kubectl set image deployment/protein-villa-frontend frontend=${DOCKER_REGISTRY}/protein-villa-frontend:${IMAGE_TAG} -n protein-villa"
                    sh "kubectl rollout status deployment/protein-villa-backend -n protein-villa"
                    sh "kubectl rollout status deployment/protein-villa-frontend -n protein-villa"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Protein Villa pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed during build or deployment."
        }
    }
}
```

---

## 3. GitHub Actions Workflow Example (`.github/workflows/deploy.yml`)

```yaml
name: Protein Villa CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Test Backend
        run: |
          cd backend
          npm ci
          npx prisma generate
          npm test

      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Build Docker Compose Stack
        run: |
          docker compose build
```
