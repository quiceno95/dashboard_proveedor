# Dashboard de Servicios Turísticos

Dashboard responsive en React para la administración de servicios turísticos (hoteles, restaurantes y experiencias) con autenticación JWT y diseño moderno.

## 🚀 Características

- **Autenticación JWT**: Login seguro con tokens y cookies
- **Diseño Responsive**: Adaptable a todos los dispositivos
- **Multi-usuario**: Soporte para hoteles, restaurantes y experiencias
- **UI Moderna**: Diseño basado en TailwindCSS con componentes personalizados
- **Iconografía**: Lucide React para iconos consistentes
- **Tipografía**: Fuente Inter de Google Fonts

## 🛠️ Tecnologías

- **React 18**: Framework principal
- **React Router DOM**: Navegación y rutas
- **TailwindCSS**: Framework de estilos
- **Lucide React**: Biblioteca de iconos
- **Axios**: Cliente HTTP
- **JWT Decode**: Decodificación de tokens
- **JS Cookie**: Manejo de cookies
- **SweetAlert2**: Alertas y modales

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd dashboard-proveedor
```

2. Instala las dependencias:
```bash
npm install
```

3. Agrega las imágenes requeridas en la carpeta `public/`:
   - `logo-vertical-color.png`
   - `ffondo-login.png`

4. Inicia el servidor de desarrollo:
```bash
npm start
```

## 🔐 Autenticación

### API Endpoint
```
POST https://back-services.api-reservat.com/api/v1/usuarios/login
```

### Credenciales de ejemplo
```json
{
  "email": "quiceno_hotel@email.com",
  "contraseña": "12345678"
}
```

### Respuestas de la API

**Éxito (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errores**:
- `404`: El usuario no existe
- `401`: Credenciales incorrectas
- `403`: El usuario no está activo
- `500`: Error interno del servidor

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── Login.jsx                 # Componente de login
│   ├── HotelDashboard.jsx        # Dashboard para hoteles
│   ├── RestaurantDashboard.jsx   # Dashboard para restaurantes
│   └── ExperienceDashboard.jsx   # Dashboard para experiencias
├── services/
│   └── authService.js            # Servicio de autenticación
├── App.js                        # Componente principal
├── index.js                      # Punto de entrada
└── index.css                     # Estilos globales
```

## 🎨 Guía de Estilos

### Paleta de Colores
- **Principal**: `#263DBF` (azul corporativo)
- **Secundario**: `#2E3C8C` (azul oscuro)
- **Complementarios**: `#D9779B` (rosa), `#F2785C` (naranja)

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Títulos**: `text-3xl font-bold`
- **Subtítulos**: `text-lg font-medium`
- **Texto normal**: `text-sm font-medium`

### Componentes Personalizados
- `.btn-primary`: Botón principal con gradiente
- `.btn-secondary`: Botón secundario
- `.input-field`: Campo de entrada estilizado
- `.card`: Tarjeta con sombra suave

## 🔄 Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales
2. **Validación**: Se envían a la API
3. **JWT**: Se recibe y decodifica el token
4. **Cookie**: Se almacena con fecha de expiración
5. **Redirección**: Según `tipo_usuario`:
   - `hotel` → Dashboard de Hotel
   - `restaurante` → Dashboard de Restaurante
   - `experiencia` → Dashboard de Experiencias

## 🛡️ Seguridad

- Tokens JWT almacenados en cookies seguras
- Verificación automática de expiración
- Rutas protegidas con autenticación
- Logout automático en tokens inválidos

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚧 Estado Actual

Las vistas de dashboard muestran información básica y un mensaje de "Sitio en construcción" mientras se desarrollan las funcionalidades completas.

## 📝 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm eject`: Expone la configuración de webpack

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.
