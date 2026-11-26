# Proyecto Final - API de Repuestos de Autos.

API REST para la gestión de catálogo de repuestos de autos, con autenticación mediante JWT y conexión a base de datos Firestore de Firebase.

## Cómo correr el proyecto

1. Instalar dependencias:
```bash
npm install
```

2. Configurar las variables en el archivo `.env` (usar `.env.example` de guía).

3. Iniciar el servidor:
```bash
npm start
```

El servidor arranca por defecto en `http://localhost:3000`.

---

## Usuario de prueba (Login)

Para autenticarse y poder probar las rutas protegidas:
- **Endpoint:** `POST /auth/login`
- **Email:** `admin@techlab.com`
- **Password:** `admin1234`

La respuesta devuelve el token que hay que enviar en la cabecera `Authorization: Bearer <token>`.

---

## Rutas de la API

### Productos (Públicas)
- `GET /api/products`: devuelve el listado completo de repuestos.
- `GET /api/products/:id`: busca un repuesto por ID.

### Productos (Protegidas con Token)
- `POST /api/products/create`: crea un repuesto nuevo (requiere `name` y `price`).
- `PUT /api/products/:id`: actualiza los datos de un repuesto.
- `DELETE /api/products/:id`: elimina un repuesto por ID.

Ejemplo de body en JSON para crear o editar:
```json
{
  "name": "Filtro de Aire Bosch",
  "price": 18500,
  "stock": 15,
  "category": "Filtros",
  "description": "Filtro de aire de motor"
}
```

---

## Códigos de error implementados

- **400:** Datos inválidos o incompletos (por ejemplo si falta el nombre o el precio es negativo).
- **401:** Acceso no autorizado (cuando falta el token o las credenciales son incorrectas).
- **403:** Acceso prohibido (token inválido o expirado).
- **404:** Ruta o producto no encontrado.
- **500:** Error interno del servidor o problemas con el servicio de base de datos.
