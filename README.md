# 🧰 ToolHub — Plataforma Modular de Utilidades para Desarrolladores  
**Backend:** Django + Django REST Framework  
**Frontend:** React + Vite  
**DB:** PostgreSQL  
**Proxy:** Nginx  
**Orquestación:** Docker Compose  

ToolHub es una aplicación modular diseñada para centralizar herramientas útiles para desarrolladores, QA, pentesters y administradores de sistemas.  
La plataforma está construida con una arquitectura completamente desacoplada: cada componente (frontend, backend, base de datos y proxy) se ejecuta en su propio contenedor, lo que facilita el mantenimiento, escalabilidad y despliegue en cualquier entorno.

# Características principales

### Backoffice React con interfaz limpia y reactividad  
### API REST completa (Django + DRF)  
### Auditoría completa (logs de herramientas + logs globales de API)  
### Múltiples módulos listos para producción:
- Web Scraper avanzado (BeautifulSoup)
- Verificador de sitios web (estado, certificado SSL, accesibilidad)
- Formateador JSON / XML / YAML
- Conversor de Hash (MD5, SHA256, bcrypt)
- Generador de JWT (HS256/384/512)
- Generador dinámico de Matrices de Pruebas
- Módulo de Auditoría en tiempo real

# Arquitectura del Proyecto

```

+---------------------------------------------------+
|                     NGINX                         |
| Reverse Proxy — enrutamiento frontend/backend     |
+--------------------------+------------------------+
|
+-------------------+--------------------+
|                                        |
+------v------+                        +--------v---------+
|  FRONTEND   |                        |     BACKEND      |
| React + Vite|  <-- API REST -->      | Django + DRF     |
| puerto 80   |                        | puerto 8000      |
+-------------+                        +------------------+
|
+---------v--------+
|    DATABASE      |
|   PostgreSQL     |
+------------------+

```

# Estructura de Directorios

```

toolhub/
│
├── backend/
│   ├── toolhub_api/          # Configuraciones principales de Django
│   ├── tools/                # App principal de funcionalidades
│   │   ├── views.py          # Endpoints
│   │   ├── models.py         # ToolLog (auditoría)
│   │   ├── urls.py
│   │   ├── utils.py
│   │   └── decorators.py     # Decorador de auditoría por herramienta
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── tools/            # Componentes del backoffice
│   │   ├── App.js
│   │   ├── Layout.jsx        # Header + Footer
│   │   └── styles
│   ├── Dockerfile
│   └── vite.config.js
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md

```

# Ambientación 

## 1. Clonar repositorio
```bash
git clone https://github.com/TU_USUARIO/toolhub.git
cd toolhub
```

## 2. Construir servicios

```bash
docker-compose build
```

## 3. Levantar contenedores

```bash
docker-compose up -d
```

## 4. Crear superusuario para Django

```bash
docker-compose run backend python manage.py createsuperuser
```

## 5. Entrar al sistema

* [http://localhost](http://localhost)


# Pruebas de Endpoints con Insomnia

Ejemplo: Generador de JWT

```
POST http://localhost/api/tools/jwt/

{
  "payload": {"sub": "arturo"},
  "secret": "123456",
  "expires_in": 3600,
  "algorithm": "HS256"
}
```

Otros endpoints disponibles:

| Función                   | Método | Ruta                       |
| ------------------------- | ------ | -------------------------- |
| Web Scraper               | POST   | `/api/tools/scrape-tags/`  |
| Formateador JSON/XML/YAML | POST   | `/api/tools/format/`       |
| Hash                      | POST   | `/api/tools/hash/`         |
| JWT                       | POST   | `/api/tools/jwt/`          |
| Test Matrix               | POST   | `/api/tools/test-matrix/`  |
| Checker de Sitios         | POST   | `/api/tools/site-checker/` |
| Auditoría                 | GET    | `/api/tools/logs/`         |

# 🧰 Funcionalidades del Backoffice

## 🔎 1. Web Scraper

Permite analizar sitios web y buscar etiquetas específicas:

* Etiqueta: `div`, `span`, etc.
* Clase o ID
* Lista de sitios vía textarea

Retorna una tabla con:

* Ocurrencias
* Errores
* Multiplicidad


## 🌐 2. Verificador de Sitios Web

Evalúa:

* Certificado SSL
* Fecha de expiración
* Disponibilidad vía HTTP
* Errores DNS / Timeout

Basado en script de Arturo con `ssl`, `socket`, `requests`.



## 📦 3. Formateador JSON/XML/YAML

Convierte entre:

* JSON
* XML
* YAML

Manejo automático de errores de formato.


## 🔐 4. Generador de JWT

Soporta:

* HS256
* HS384
* HS512
  Incluye:
* Payload en JSON
* Clave secreta
* Expiración personalizada


## 🔑 5. Conversor de Hash

Convierte cadenas en:

* MD5
* SHA1
* SHA256
* SHA512
* bcrypt

## 🧪 6. Generador de Matrices de Pruebas

Crea combinaciones de datos para casos de prueba.
Ejemplo de entrada:

```json
{
  "dimensions": [
    {"name": "usuario", "values": ["admin", "guest"]},
    {"name": "password", "values": ["correcto", "incorrecto"]}
  ]
}
```


## 📜 7. Auditoría Completa

Registra:

* Herramienta utilizada
* Endpoint
* Request
* Response
* IP
* Usuario
* Código HTTP
* created_at / deleted_at

Interfaz con filtros por:

* Tool
* Endpoint
* IP
* Fecha


# 🛡 Sistema de Auditoría

### Decorador por Herramienta

En `decorators.py`:

```python
@log_tool_usage("Hash Tool")
def post(...)
```

### Middleware Global

Registra cualquier request `/api/*`.

### Vista en React

Página `/tools/audit`.

# Comandos útiles

### Ver logs del backend

```bash
docker logs toolhub_backend --tail 200
```

### Reconstruir contenedores

```bash
docker-compose build
docker-compose up -d
```

### Entrar al contenedor del backend

```bash
docker exec -it toolhub_backend bash
```

# Contribución

Por favor, revisa nuestra [Guía de Contribución](CONTRIBUTING.md) para conocer los detalles sobre cómo proponer cambios.

# Autores

**Arturo Rodríguez Rodríguez**
**Jesús Abner Domínguez Chávez**
**Luis Daniel Dominguez Ríos**
**Johan Sanchez Villalpando**
**Saida Mayela Sánchez Calvillo**
**José Ramón Aguilar Pérez**


