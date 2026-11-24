# Walter’s Digital Lab

Cuaderno personal de Walter para **Conceptos básicos de redes v2.0 de Cisco Networking Academy** y sus sesiones de Linux. La web funciona en localhost, con un tutor IA local opcional para redes.

## Abrir en Windows

Abre esta carpeta en VS Code. Necesitas Node.js compatible (>=22.23.4).

```powershell
npm.cmd ci
npm.cmd run dev
```

El comando abre la portada en el navegador y muestra la dirección local en la terminal (normalmente http://127.0.0.1:4321/). La terminal mantiene activo el servidor local. Al cerrarla se detiene la vista previa, pero tus archivos permanecen. Reinicia el comando para volver a verla.

La ruta principal abre la portada. Pulsa el computador o selecciónalo con Tab y Enter para acceder al inicio. También puedes abrir `/inicio/` directamente.

## Plan de estudio

El plan contiene **17 módulos y 44 temas**, organizados a partir de las capturas proporcionadas por Walter. Se conservan el orden, los nombres y los objetivos con pequeños ajustes de redacción. La captura repetida del módulo 6 se incluyó una sola vez. No se incluyen exámenes, encuestas, introducciones ni resúmenes del curso como tareas adicionales.

- Abre **Plan de estudio** y despliega un módulo.
- Consulta el objetivo general y el objetivo de cada tema.
- Marca temas individuales o usa **Marcar todo el módulo**.
- Los contadores muestran temas completados y módulos con todos sus temas marcados.
- Las marcas empiezan vacías. El avance es personal y no se sincroniza con Cisco.
- Usa **Exportar respaldo** para guardar tu checklist. Importar reemplaza las marcas actuales.

El progreso de este curso utiliza una clave distinta del antiguo roadmap general. El almacenamiento anterior no se elimina ni se interpreta como avance de Cisco.

## Apuntes por módulo

1. En el plan, pulsa **Mis apuntes del módulo**.
2. El editor prepara título, objetivo general, lista de objetivos y apartados numerados por tema.
3. Escribe debajo de **Mis apuntes** y añade ejemplos con tus palabras, dudas y tu resumen personal.
4. Cambia de módulo con el selector: cada módulo tiene un borrador independiente. También existe **Apunte libre de redes**, que conserva el borrador general anterior.
5. Usa **Descargar Markdown** para conservar una copia fuera del navegador.

Los borradores se guardan al escribir. Cada dirección local y cada puerto tiene su propio almacenamiento. Si hay copias recuperadas del módulo 1 o del día 1 de Linux en `private/recuperacion`, el laboratorio local restaura una entrada ausente o una versión más corta que coincida con el inicio del original. Conserva las ediciones distintas y mantiene las copias recuperadas fuera de Git. No sobrescribimos un borrador existente con la plantilla. Los apuntes no aparecen automáticamente en el diario: para añadirlos, guarda el Markdown en `src/content/notes/` y cambia `draft: true` a `draft: false` cuando quieras mostrarlo. Esta colección de Markdown está dedicada a Redes.

### Imágenes

Coloca capturas en `src/assets/` e inclúyelas en un apunte con:

```markdown
![Descripción de la captura](../../assets/mi-captura.png)
```

Las imágenes del proyecto se muestran cuando el archivo está incorporado al proyecto. El editor muestra una indicación para imágenes locales; admite imágenes HTTPS en su vista previa. Revisa que las capturas no contengan datos personales antes de publicarlas.

## Herramientas y lectura del día

**Herramientas** reúne fichas de redes y defensa, un apartado de forensia digital y dos casos reales con esquemas explicativos y enlaces a sus informes originales.

**Diario de estudio** muestra una lectura con fuente y práctica. La edición cambia desde las **08:00 de Bogotá** cuando hay material nuevo. **Guardar lectura** conserva una copia en ese navegador; una lectura sin guardar deja su lugar a la siguiente. El diario conserva la última edición válida si falla una consulta.

El diario toma texto escrito en los borradores de Cisco, los días de Linux y los apuntes publicados por el autor. Descarta las líneas de plantilla y los ejemplos del proyecto. Al usar la app local guarda una muestra de hasta 60 apuntes (hasta 18.000 caracteres útiles por apunte) en `private/perfil-estudio.json`. La tarea de las 08:00 de Bogotá usa esa muestra para investigar un tema ya estudiado y estimar el nivel según una cita concreta. En el diario puedes leer esa cita y el nivel sugerido. Si faltan apuntes, el diario espera. Los guardados anteriores siguen disponibles en ese navegador.

**Actualizar** vuelve a revisar tus apuntes con Gemma y busca publicaciones de los últimos 90 días en Cisco Blogs, Ars Technica y TechCrunch. El diario muestra la fuente y su fecha. Dispones de una recarga manual por edición, que se renueva a las 08:00 de Bogotá. Guardar, abrir la página o recibir la edición automática conserva el cupo. Los intentos sin una lectura pertinente también lo conservan. Solo se envía a los buscadores el término técnico. La edición personalizada requiere el servidor local, Ollama e Internet.

En el editor de un módulo, **Completar módulo** marca sus temas en el plan. El resumen de Cisco sigue en Ollama al cambiar de sección mientras el servidor local está abierto. Un número junto a **Plan de estudio** indica cuántas respuestas quedan por revisar.
