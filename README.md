# Sistema de Gestión de Tareas (NestJS + GraphQL + AOP + GitFlow)

Este proyecto implementa un servidor backend para la gestión de tareas de proyectos de desarrollo de software utilizando **NestJS** y **GraphQL** (enfoque Code-First). Cumple rigurosamente con los lineamientos de **Programación Orientada a Aspectos (AOP)**, **Clean Code**, **JSDoc**, **Logs estructurados** y la metodología **GitFlow**.

---

## Criterios de Evaluación Implementados

### 1. Programación Orientada a Aspectos (AOP)
Los aspectos transversales (*cross-cutting concerns*) han sido desacoplados de la lógica de negocio y encapsulados en interceptores y filtros globales dentro de la carpeta `src/common/`:
*   **Aspecto de Registro (`LoggingInterceptor`)**: Intercepta automáticamente todas las consultas (Queries) y mutaciones (Mutations) de GraphQL. Registra los argumentos de entrada, el resolver que se está ejecutando y mide el tiempo total de respuesta en milisegundos.
*   **Aspecto de Auditoría (`AuditLogInterceptor` + `@AuditLog`)**: Mediante el decorador personalizado `@AuditLog('ACCIÓN')`, intercepta las mutaciones para registrar logs estructurados en consola detallando qué cambio de estado se realizó, qué payload se recibió y cuál fue el ID afectado (ej. al crear, editar o eliminar tareas).
*   **Aspecto de Manejo de Excepciones (`GraphQLExceptionFilter`)**: Captura cualquier error no controlado que ocurra en los resolvers, registrando la ruta del error, los argumentos de entrada y la traza de la pila (*stack trace*), formateando de forma limpia las respuestas que recibe el cliente.

### 2. Clean Code y JSDoc
*   El código se encuentra modularizado en tres áreas de dominio independientes: `Tasks` (Tareas), `Users` (Usuarios) y `Projects` (Proyectos).
*   Se utilizan DTOs estrictos (`CreateTaskInput`, `UpdateTaskInput`, `FilterTasksInput`) con reglas de validación sólidas (`class-validator`) que garantizan la integridad de los datos de entrada.
*   Toda la base del código (servicios, controladores/resolvers, entidades y módulos) está exhaustivamente documentada en español utilizando el estándar **JSDoc**.

### 3. Implementación de Logs en el Servidor
Se hace uso del logger nativo de NestJS (`Logger`), configurando contextos legibles (`GraphQLAspectLogger`, `AuditAspectLogger`, `ExceptionAspectLogger`) para diferenciar con claridad los registros de rendimiento, auditorías de estado y alertas de excepciones.

### 4. GitFlow y .gitignore
*   El desarrollo se realizó siguiendo GitFlow de manera estricta:
    *   `main`: Rama de producción (con versión final etiquetada como `v1.0.0`).
    *   `develop`: Rama de integración donde se consolidaron los cambios.
    *   `feature/task-management`: Rama de desarrollo donde se implementó la lógica.
*   Se configuró correctamente el archivo `.gitignore` para omitir y no subir al repositorio la carpeta `node_modules/` ni posibles archivos de entorno `.env`.

---

## 🛠️ Cómo Correr el Proyecto Localmente

### 1. Clonar el repositorio e instalar dependencias
Una vez tengas el código localmente, abre una terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 2. Levantar el Servidor en modo desarrollo
Ejecuta el siguiente comando para arrancar la aplicación NestJS:
```bash
npm run start:dev
```
El servidor compilará los módulos, generará el esquema GraphQL automáticamente en `src/schema.gql` y se mantendrá a la escucha en:
`🚀 Servidor de Tareas ejecutándose en: http://localhost:3000/graphql`

---

## 🔍 Pruebas de la API GraphQL

Abre tu navegador de preferencia e ingresa a: **[http://localhost:3000/graphql](http://localhost:3000/graphql)** para acceder al entorno interactivo de **Apollo Sandbox** / **Playground**. 

Puedes probar las siguientes operaciones:

### A. Consultar todas las tareas (Query `tasks`)
```graphql
query {
  tasks {
    id
    title
    description
    status
    tags
    assignedUser {
      name
      email
    }
    project {
      name
      description
    }
  }
}
```

### B. Crear una tarea (Mutation `createTask`)
```graphql
mutation {
  createTask(createTaskInput: {
    title: "Implementar Front-End"
    description: "Crear componentes React para visualizar el backlog de tareas"
    status: BACKLOG
    tags: ["frontend", "react"]
    projectId: "project-2"
    assignedUserId: "user-2"
  }) {
    id
    title
    status
    createdAt
    assignedUser {
      name
    }
    project {
      name
    }
  }
}
```

### C. Editar una tarea (Mutation `updateTask`)
*(Reemplaza `"PEGAR_EL_ID_DE_LA_TAREA_CREADA"` por el ID correspondiente)*
```graphql
mutation {
  updateTask(updateTaskInput: {
    id: "PEGAR_EL_ID_DE_LA_TAREA_CREADA"
    status: IN_PROGRESS
    tags: ["frontend", "react", "apollo-client"]
    assignedUserId: "user-3"
  }) {
    id
    title
    status
    tags
    assignedUser {
      name
    }
  }
}
```

### D. Eliminar una tarea (Mutation `removeTask`)
```graphql
mutation {
  removeTask(id: "PEGAR_EL_ID_DE_LA_TAREA_CREADA")
}
```

---

## Pruebas Automatizadas y Simulación de AOP
El proyecto cuenta con un script de prueba de integración en Node.js que ejecuta todo el ciclo de vida de la API (consultar semilla, crear tarea, consultar individual, editar, eliminar y forzar una excepción controlada 404).

Para correr esta simulación y ver los resultados de los aspectos en consola en tiempo real:
1. Asegúrate de tener levantado el servidor NestJS (`npm run start:dev`).
2. Abre otra terminal y ejecuta el script:
   ```bash
   node scratch/test_api.js
   ```
   *(Nota: Puedes encontrar el script de prueba original guardado en el directorio de pruebas internas para comprobar las respuestas esperadas).*
