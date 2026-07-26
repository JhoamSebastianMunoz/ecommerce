# ADR 0001: Arquitectura de Monolito Modular

## Contexto

El sistema e-commerce debe ser desarrollado como una aplicación que permita futura extracción a microservicios sin reescritura del dominio.

## Decisión

Adoptar un **monolito modular** con Bounded Contexts claramente delimitados. Cada contexto tiene su propia estructura de carpetas (domain, application, infrastructure) y se comunica con otros contextos exclusivamente vía eventos de dominio o puertos (Anti-Corruption Layer).

## Alternativas Consideradas

- **Microservicios desde el inicio:** Mayor complejidad operativa, necesidad de orquestación distribuida, más difícil de testear localmente.
- **Monolito monolítico sin módulos:** Acoplamiento alto, difícil de mantener y evolucionar.

## Consecuencias

- ✅ Menor complejidad operativa en desarrollo
- ✅ Facilita la extracción a microservicios futura (cada contexto es un módulo independiente)
- ✅ Comparte base de datos (transacciones ACID dentro de un contexto)
- ❌ Consistencia eventual entre contextos (gestionada vía eventos)

## Referencias

- AGENTS.md §1: "monolito modular (no microservicios, aunque el diseño debe permitir extraerlos después)"
