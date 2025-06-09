# Manual de Despliegue - API Laravel en Windows

## Requisitos Previos

### 1. Instalar PHP (versión 8.1 o superior)
1. Descargar PHP
4. Agregar `C:\php` a las variables de entorno PATH
5. Copiar `php.ini-development` como `php.ini`
6. Editar `php.ini` y habilitar las siguientes extensiones:

   ```ini
   extension=curl
   extension=fileinfo
   extension=gd
   extension=mbstring
   extension=openssl
   extension=pdo_mysql
   extension=zip
   ```

### 2. Instalar Composer
1. Descargar desde: https://getcomposer.org/download/
2. Ejecutar el instalador `Composer-Setup.exe`
3. Verificar instalación: `composer --version`

### 3. Instalar MySQL/MariaDB
**XAMPP (Recomendado para desarrollo)**
1. Descargar XAMPP desde: https://www.apachefriends.org/
2. Instalar y ejecutar Apache y MySQL desde el panel de control

## Pasos de Instalación

# 1. Preparar el Proyecto
### Extraer los archivos del proyecto en una carpeta


# 2. Instalar Dependencias de PHP
### Abrir terminal en la carpeta del proyecto
```
composer install
```

# 3. Configurar Variables de Entorno
### Copiar el archivo de ejemplo
```
copy .env.example .env
```

### Generar clave de aplicación
```
php artisan key:generate
```
# 4. Configurar Base de Datos
Editar el archivo `.env` con los datos de tu base de datos:
```env
APP_NAME="API Anab"
APP_ENV=local
APP_KEY=base64:TU_CLAVE_GENERADA
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=api_anab
DB_USERNAME=root
DB_PASSWORD=
```

# 5. Crear Base de Datos

# 6. Ejecutar Migraciones y Seeders
```bash
### Ejecutar migraciones
php artisan migrate
```

# 7. Crear Enlace Simbólico para Storage
```bash
php artisan storage:link
````

# 9. Iniciar el Servidor
```
### Servidor de desarrollo de Laravel
php artisan serve
```

La API estará disponible en: `http://localhost:8000`


### Configuración para Producción

# 1. Configurar Servidor Web (Apache/Nginx)
**Para Apache (.htaccess ya incluido):**
- Apuntar DocumentRoot a la carpeta `public/`
- Habilitar mod_rewrite

**Para Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/al/proyecto/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```