---
title: "Comprobar la integridad de un archivo"
description: "Un laboratorio introductorio en PowerShell para comparar hashes SHA-256 de un archivo de prueba y su copia."
date: 2026-11-23
category: DFIR
tags: [sha256, integridad, powershell]
draft: false
example: true
---

## Objetivo

Observar cómo un hash ayuda a comparar el contenido de dos archivos. Esta es una **práctica propuesta**, no un informe de resultados ya obtenidos.

## Entorno

Windows y PowerShell, en una carpeta nueva destinada a esta práctica. Usa únicamente archivos de prueba.

## Procedimiento

1. Crea un archivo de texto nuevo llamado `muestra.txt` y escribe una frase.
2. Haz una copia con otro nombre, `copia.txt`.
3. Ejecuta los siguientes comandos desde esa carpeta:

```powershell
Get-FileHash -LiteralPath .\muestra.txt -Algorithm SHA256
Get-FileHash -LiteralPath .\copia.txt -Algorithm SHA256
```

4. Compara los valores y anota el resultado.
5. Modifica únicamente la copia, guárdala y vuelve a calcular ambos hashes.

## Registro de evidencia

| Archivo | SHA-256 | Fecha y hora | Observaciones |
| --- | --- | --- | --- |
| muestra.txt | Completar | Completar con zona horaria | Original de práctica |
| copia.txt | Completar | Completar con zona horaria | Copia antes o después del cambio |

## Conclusiones y límites

¿Coincidían los hashes antes del cambio? ¿Qué ocurrió después? Un hash por sí solo no prueba quién creó un archivo, cuándo se creó o si su contenido es verdadero.
