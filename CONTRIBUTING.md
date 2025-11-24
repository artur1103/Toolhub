## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1.  **Haz un Fork:** Crea un fork de este repositorio en tu cuenta de Codigo Fuente.
2.  **Crea una Rama:** Clona tu fork localmente y crea una nueva rama para tus cambios, siguiendo el flujo de trabajo de **[Git Flow](https://docs.github.com/en/get-started/using-github/github-flow)**:    
    * Para una nueva funcionalidad: `git checkout -b feature/nombre-de-la-funcionalidad`
    * Para una corrección: `git checkout -b fix/descripcion-del-problema`
3.  **Realiza tus Cambios:** Implementa tu funcionalidad o corrección. Asegúrate de seguir los estándares de desarrollo del proyecto.
4.  **Haz Commit:** Guarda tus cambios con un mensaje claro, utilizando la convención **[Conventional Commits](https://www.conventionalcommits.org/)**.

    ```bash
    git add .
    git commit -m
    "feat: descripción de la nueva funcionalidad"
    o "fix: descripción de la corrección"
    ```
5.  **Empuja tus Cambios (Push):** Sube tu rama a tu fork en Codigo Fuente:
    ```bash
    git push origin feature/nombre-de-la-funcionalidad
    ```
6.  **Abre un Merge Request:** Desde tu fork en Codigo Fuente, crea un Merge Request hacia la rama principal `develop` del repositorio original. Describe claramente tus cambios, incluyendo el propósito, contexto y cualquier detalle técnico relevante.

### Flujo de trabajo Git

Actualmente existe un estandar en el flujo de trabajo para **Git**.  
La idea principal es **crear una rama por actividad**.

#### Formato de ramas
```bash
tipo/descripcion-actividad
```
**Ejemplo base**

#### Rama en Git:
```bash
feature/backend-filtro-nombre
```

#### Commits:
En el mensaje de cada commit, se debe incluir la actividad y el tipo.
```bash
git commit -m "feat(filtros-busqueda): Implementa query para buscar por nombre completo (Backend)"
```

#### Merge Request (MR)
- El título del MR debe ser claro.
- La descripción debe incluir una breve explicación de los cambios.
    
    **Ejemplo de título de MR:**
    ```bash
    Backend: Filtro por Nombre Completo
    ```

    **Ejemplo de descripción de MR:**
    ```bash
    Se implementa el filtro por Nombre Completo en el backend para facilitar la búsqueda de capturistas.
    ```
