graph TD

    subgraph T1["Tier 1: Presentation Layer"]
        A["React 18 + TypeScript + Vite"]
        B["Tailwind CSS + Dark/Light Theme"]
        C["Three.js + React Three Fiber 3D Product Canvas"]
        D["Recharts Analytics + Canvas Confetti"]
        E["Context Providers: Auth, Cart, Wishlist, Compare, Toast"]
    end

    subgraph T2["Tier 2: Application and API Layer"]
        F["Node.js + Express.js + TypeScript"]
        G["Middleware: Rate Limiter, Helmet, CORS, Error Handler"]
        H["Security: JWT Authentication and RBAC Guards"]
        I["Validation: Zod Schema Validators"]
        J["Controllers and Business Logic Services"]
    end

    subgraph T3["Tier 3: Data and Persistence Layer"]
        K["Prisma ORM Client"]
        L["Relational Database Schema: 16 Models"]
        M[("SQLite Local / PostgreSQL Production")]
    end

    T1 -->|"HTTPS / REST API / JSON"| T2
    T2 -->|"Type-Safe Prisma Queries"| T3
