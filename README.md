# API REST de Gestión de Productos - Techlab

Proyecto Final obligatorio del curso. Sistema Backend desarrollado con **Node.js**, **Express**, **Firebase Firestore** y autenticación mediante **JSON Web Tokens (JWT)**.

---

## 🏗️ Arquitectura del Proyecto (Capas)

El proyecto está diseñado bajo una arquitectura limpia en capas, garantizando escalabilidad, mantenibilidad y separación de responsabilidades:

```
proyecto-final-techlab/
├── index.js                     # Punto de entrada y configuración del servidor Express
├── package.json                 # Dependencias y scripts del proyecto
├── .env                         # Variables de entorno privadas (no se sube al repo)
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos y directorios excluidos de Git
└── src/
    ├── config/
    │   └── firebase.config.js   # Inicialización y conexión con Firebase Firestore
    ├── controllers/
    │   ├── auth.controller.js   # Manejo de peticiones y respuestas para autenticación
    │   └── products.controller.js # Manejo de peticiones y respuestas para productos
    ├── middlewares/
    │   └── auth.middleware.js   # Protección de rutas con verificación de Bearer Token JWT
    ├── models/
    │   └── products.model.js    # Interacción directa con la colección de Firestore
    ├── routes/
    │   ├── auth.routes.js       # Definición de rutas de login
    │   └── products.routes.js   # Definición de rutas CRUD de productos
    └── services/
        ├── auth.service.js      # Lógica de negocio y generación de tokens JWT
        └── products.service.js  # Lógica de negocio y validación de productos
```

---

## 🚀 Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/borella11/proyecto-final-techlab.git
   cd proyecto-final-techlab
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Copia el archivo `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```
   Y completa los datos con tus credenciales de Firebase Firestore:
   ```env
   PORT=3000
   JWT_SECRET=supersecreto_jwt_techlab_2026
   JWT_EXPIRES_IN=2h
   ADMIN_EMAIL=admin@techlab.com
   ADMIN_PASSWORD=admin1234

   FIREBASE_API_KEY=tu_api_key
   FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   FIREBASE_PROJECT_ID=tu_proyecto_id
   FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   FIREBASE_APP_ID=tu_app_id
   ```

4. **Ejecutar el servidor:**
   ```bash
   npm run start
   ```

---

## 📡 Endpoints de la API

### 1. Autenticación

#### `POST /auth/login`
Autentica al usuario y retorna un Bearer Token JWT válido por 2 horas.
- **Body:**
  ```json
  {
    "email": "admin@techlab.com",
    "password": "admin1234"
  }
  ```
- **Respuesta (200 OK):**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Autenticación exitosa",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "tokenType": "Bearer",
    "expiresIn": "2h",
    "user": {
      "email": "admin@techlab.com",
      "role": "admin"
    }
  }
  ```

---

### 2. Productos

#### `GET /api/products` (Público)
Retorna la lista completa de productos disponibles en Firestore.
- **Respuesta (200 OK):**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "total": 1,
    "data": [
      {
        "id": "abc123firestoreId",
        "name": "Notebook Gamer",
        "price": 1250.00,
        "stock": 10,
        "category": "Computación"
      }
    ]
  }
  ```

#### `GET /api/products/:id` (Público)
Retorna un único producto por su ID de Firestore.
- **Respuesta (200 OK):**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "id": "abc123firestoreId",
      "name": "Notebook Gamer",
      "price": 1250.00
    }
  }
  ```

#### `POST /api/products/create` (🔒 Protegido con JWT)
Crea un nuevo producto en Firestore.
- **Headers:**
  ```http
  Authorization: Bearer <TU_TOKEN_JWT>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "Teclado Mecánico RGB",
    "description": "Switch red silencioso",
    "price": 75.50,
    "stock": 25,
    "category": "Periféricos"
  }
  ```
- **Respuesta (201 Created):**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Producto creado exitosamente",
    "data": {
      "id": "nuevoIdFirestore",
      "name": "Teclado Mecánico RGB",
      "price": 75.50
    }
  }
  ```

#### `PUT /api/products/:id` (🔒 Protegido con JWT)
Actualiza campos de un producto existente.
- **Headers:** `Authorization: Bearer <TU_TOKEN_JWT>`
- **Body:**
  ```json
  {
    "price": 69.99,
    "stock": 30
  }
  ```
- **Respuesta (200 OK):**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Producto actualizado exitosamente",
    "data": { ... }
  }
  ```

#### `DELETE /api/products/:id` (🔒 Protegido con JWT)
Elimina un producto por su ID.
- **Headers:** `Authorization: Bearer <TU_TOKEN_JWT>`
- **Respuesta (200 OK):**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Producto con ID abc123firestoreId eliminado correctamente"
  }
  ```

---

## 🛡️ Manejo de Códigos de Estado HTTP

- **`200 OK`**: Petición resuelta satisfactoriamente.
- **`201 Created`**: Recurso creado exitosamente en Firestore.
- **`400 Bad Request`**: Datos faltantes o tipos de datos inválidos en el cuerpo (body).
- **`401 Unauthorized`**: Falta cabecera `Authorization` o formato de token incorrecto.
- **`403 Forbidden`**: Token JWT inválido o expirado.
- **`404 Not Found`**: Ruta desconocida o producto con ID inexistente.
- **`500 Internal Server Error`**: Falla inesperada del servidor o desconexión del servicio de Firestore.
