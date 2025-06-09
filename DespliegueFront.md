# Manual de Despliegue - React

## Requisitos Previos

# 1. Instalar 
1. Node.js (versión 16.x o superior)
2. npm (normalmente viene con Node.js)


# 2. Instalar dependencias
```
npm install
```
Este comando instalará todas las dependencias necesarias listadas en el `package.json`.


# 3. Instalar Dependencias principales (dependencies)
```
npm install react react-dom react-router-dom @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/list @fullcalendar/interaction @fullcalendar/core
```


# 4. Instalar Dependencias de desarrollo (devDependencies)
```
npm install -D vite @vitejs/plugin-react @types/react @types/react-dom eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

# 5. Iniciar el Servidor
```
### Servidor corriendo
npm run dev
```

La API estará disponible en el puerto indicado desde la terminal al ejecutar `npm run dev`