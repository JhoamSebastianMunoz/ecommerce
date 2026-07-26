# ADR 0004: Saga Orquestada en Checkout

## Contexto

El flujo de checkout involucra múltiples Bounded Contexts (Catálogo para reservar stock, Pagos para procesar cobro, Envíos para crear envío) con necesidad de compensación ante fallos en cualquier paso.

## Decisión

Implementar el flujo de checkout como **Saga Orquestada** con un coordinador explícito (`CheckoutSaga`) que maneja la secuencia de pasos y sus compensaciones.

## Alternativas Consideradas

1. **Saga Coreografiada:** Cada paso emite evento y el siguiente reacciona. Menos visibilidad, difícil de depurar, timeouts y compensaciones desordenadas.
2. **Transacción distribuida (2PC):** No disponible en arquitectura de monolito modular con base de datos compartida pero contextos separados.

## Consecuencias

- ✅ Visibilidad centralizada del estado de la saga
- ✅ Control de timeouts por paso
- ✅ Compensaciones ordenadas y predecibles
- ✅ Más fácil de depagar y testear
- ❌ Punto único de coordinación (mitigado: es in-proceso, no servicio externo)

## Referencias

- AGENTS.md §2: "El flujo de Checkout se modela como Saga orquestada, con un coordinador explícito"
- DECISIONS.md: Decisión 4