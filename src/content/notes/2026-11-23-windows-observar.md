---
title: "Windows: empezar por observar"
description: "Una guía de escritura para reconocer procesos, servicios y preguntas antes de investigar."
date: 2026-11-23
category: Windows
tags: [procesos, powershell, sistemas]
draft: false
example: true
---

## Objetivo de la sesión

Reconocer qué está ejecutando mi equipo y aprender a describirlo sin sacar conclusiones apresuradas.

## Una consulta de partida

```powershell
Get-Process | Select-Object -First 10 Name, Id
```

Esta consulta muestra nombres e identificadores de algunos procesos. **Un nombre desconocido no es evidencia suficiente de un incidente.** Necesitaría contexto y más comprobaciones.

## Mi tabla de observaciones

| Observación | Explicación | Duda pendiente |
| --- | --- | --- |
| Nombre del proceso | Completar durante la práctica | ¿Qué aplicación lo inicia? |
| Identificador | Completar durante la práctica | ¿Cambia al reiniciar? |

## Conexión con DFIR

Documentar el momento, el comando y lo observado ayuda a distinguir los hechos de las hipótesis. Esta entrada es una plantilla: todavía no contiene resultados de una práctica real.
