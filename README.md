# Proyecto Final - API REST de Productos (Techlab)

API REST desarrollada con Node.js, Express, Firebase Firestore y autenticación con JWT.

## Estructura del Proyecto

El código está separado en capas para ordenar las responsabilidades:

- `src/config/`: Conexión con Firebase.
- `src/controllers/`: Controladores que reciben las peticiones y devuelven respuestas.
- `src/middlewares/`: Middleware para validar el token JWT.
- `src/models/`: Modelo para consultar la base de datos Firestore.
- `src/routes/`: Definición de endpoints.
- `src/services/`: Lógica de negocio y validaciones.

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
```

2. Configurar las variables en el archivo `.env`:
```env
PORT=3000
JWT_SECRET=techlab_secreto_2026
ADMIN_EMAIL=admin@techlab.com
ADMIN_PASSWORD=admin1234

FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

3. Iniciar el servidor:
```bash
npm start
```

## Endpoints

### Autenticación
- `POST /auth/login`: Inicia sesión y devuelve un token Bearer.
  - Body: `{ "email": "admin@techlab.com", "password": "admin1234" }`

### Productos
- `GET /api/products`: Devuelve todos los productos (público).
- `GET /api/products/:id`: Devuelve un producto por ID (público).
- `POST /api/products/create`: Crea un nuevo producto (requiere token en Authorization header).
- `PUT /api/products/:id`: Actualiza un producto (requiere token en Authorization header).
- `DELETE /api/products/:id`: Elimina un producto (requiere token en Authorization header).

## Códigos de estado HTTP
- `200`: Petición exitosa.
- `201`: Producto creado con éxito.
- `400`: Error en los datos enviados (ej. precio negativo o campo faltante).
- `401`: No autorizado (falta token o credenciales incorrectas).
- `403`: Acceso denegado (token inválido o vencido).
- `404`: Ruta o producto no encontrado.
- `500`: Error interno del servidor o de base de datos.
