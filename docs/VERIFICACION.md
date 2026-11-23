# Actualización: plan de Cisco

23 de noviembre de 2026. Se incorporaron 17 módulos y 44 temas a partir de las capturas de Walter, sin exámenes ni encuestas. La imagen repetida del módulo 6 se deduplicó.

Verificación manual en navegador: marcar el módulo 1, recargar y comprobar 3/44 temas; desmarcarlo después. Abrir sus apuntes y comprobar la plantilla. Escribir un texto temporal, cambiar al módulo 2 y volver al 1: el borrador se conservó separado. Se restauró el texto de prueba. Revisión visual a 1280 y 390 píxeles. Las pruebas se realizaron en un puerto de revisión separado, sin modificar el progreso de localhost:4321.

Pruebas automáticas adicionales: numeración completa de módulos, 44 IDs de tema únicos, exclusión de exámenes/encuestas y conservación de objetivos en cada plantilla.

---

## Registro histórico de la primera entrega

# Verificación de la primera entrega

Fecha: 23 de noviembre de 2026. Entorno: Windows, Node.js 26.13.0, Astro 7.4.13.

## Comprobaciones realizadas

- `astro check`: sin errores ni advertencias.
- Cinco pruebas automáticas aprobadas: importación y validación de respaldos, IDs únicos, búsqueda de contenido sin tildes, categorías y orden por relevancia de título.
- Compilación de producción: 11 páginas y un índice de búsqueda estático.
- Verificación de enlaces e imágenes del sitio generado en `/` y `/walters-digital-lab/`.
- El marcador del borrador de ejemplo no aparece en el HTML ni en el índice JSON publicado.
- Respuesta HTTP 200 del inicio local.
- Navegador: marcar una habilidad, recargar y comprobar que conserva `1 de 17`; después desmarcar la marca de prueba.
- Navegador: buscar `DNS`, filtrar por Redes y abrir el apunte correspondiente.
- Navegador: crear un borrador temporal, recargar y comprobar que recupera título, resumen y Markdown.
- Navegador: la vista previa muestra Markdown formateado y elimina una etiqueta `script` del texto de prueba.
- Navegador: el botón Copiar Markdown informa de copia correcta. La descarga no se verificó manualmente.
- Revisión visual a 390 px y 1440 px, más temas claro y oscuro. Se restableció el tema oscuro y el formulario de prueba a su plantilla inicial.

## Límites de la verificación

Los workflows de GitHub y el despliegue real no se han ejecutado: falta un repositorio remoto. El parser de importación/exportación se probó automáticamente; no se recorrió el selector de archivos del navegador. No se activaron servicios de IA. Las comprobaciones manuales se hicieron con el servidor de desarrollo; el resultado estático se validó mediante compilación y comprobación de archivos y rutas.

No se modificaron resultados ni marcas de aprendizaje reales. Los ejemplos incluidos están identificados como tales.
