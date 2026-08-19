flowchart TD

    A["Frontend<br/>React + TypeScript + Vite"]
    B["UI and State Management<br/>Tailwind CSS, Context API"]
    C["3D Product Visuals<br/>Three.js + React Three Fiber"]

    D["Backend API<br/>Node.js + Express.js + TypeScript"]
    E["Security and Validation<br/>JWT, RBAC, Zod, Helmet, CORS"]
    F["Business Logic<br/>Controllers and Services"]

    G["Database Layer<br/>Prisma ORM"]
    H[("Database<br/>SQLite or PostgreSQL")]

    A --> B
    B --> C
    C --> D

    D --> E
    E --> F
    F --> G
    G --> H

    U["User / Customer"] --> A

    classDef frontend fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef backend fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef database fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px

    class A,B,C frontend
    class D,E,F backend
    class G,H database
