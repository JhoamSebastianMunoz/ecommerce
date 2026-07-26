# ADR 0006: Outbox Pattern en Checkout

## Contexto

En el flujo de checkout, si la publicación de un evento falla después de persistir la orden, se pierde el evento. Esto puede significar cobrar sin reservar stock, o viceversa, causando inconsistencias graves.

## Decisión

Aplicar **Outbox Pattern** en el flujo de checkout: los eventos de dominio se persisten en la tabla `outbox_messages` dentro de la misma transacción de base de datos que la orden, garantizando consistencia transaccional entre el estado del agregado y la publicación eventual del evento.

## Alternativas Consideradas

1. **Publicación directa en el repositorio:** Si el EventEmitter lanza una excepción después de persistir la orden, el evento se pierde (transacción ya confirmada).
2. **Event Sourcing en Checkout:** Sobredimensionado para el caso de uso; el estado actual de la orden es suficiente.

## Consecuencias

- ✅ Consistencia transaccional entre persistencia del agregado y publicación del evento
- ✅ Reintento seguro de eventos fallidos
- ✅ Idempotencia en el consumo
- ❌ Tabla adicional (outbox_messages) que requiere limpieza periódica

## Referencias

- AGENTS.md §2: "Outbox Pattern se aplica en los flujos donde un evento de dominio debe garantizar entrega"
- DECISIONS.md: Decisión 6