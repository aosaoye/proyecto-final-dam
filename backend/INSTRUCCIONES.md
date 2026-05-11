# Instrucciones de Lanzamiento del Backend

Se ha implementado una arquitectura hexagonal con Express, Mongoose (MongoDB), JWT y Multer.

Debido a las restricciones de red en el entorno de ejecución del Sandbox, la instalación de dependencias no pudo completarse automáticamente. Sigue estos pasos en tu terminal local para levantarlo:

### 1. Instalar Dependencias
Navega a la carpeta del backend e instala los paquetes:
```bash
cd backend
npm install
```

### 2. Configurar el Entorno
El archivo `.env` ya ha sido creado automáticamente con la configuración básica:
- `PORT=5000`
- `MONGO_URI=mongodb://localhost:27017/ecommerce`
- `JWT_SECRET=mySuperSecretKey123`

Asegúrate de tener una instancia de MongoDB corriendo localmente o actualiza el `MONGO_URI`.

### 3. Iniciar el Servidor
```bash
npm run dev
```

El servidor estará escuchando en el puerto 5000.
La Intranet y el sistema de Auth del frontend ya apuntan automáticamente a `http://localhost:5000/api`.
