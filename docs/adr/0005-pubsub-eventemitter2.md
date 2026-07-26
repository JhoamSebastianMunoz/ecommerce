# ADR 0005: Pub/Sub Interno con EventEmitter2

## Contexto

La comunicación entre Bounded Contexts debe ser desacoplada vía eventos. Al ser un monolito modular, se necesita un mecanismo de Pub/Sub que permita la comunicación asíncrona entre contextos sin acoplamiento directo.

## Decisión

Usar **EventEmitter2** (vía `@nestjs/event-emitter`) como bus de eventos interno, con una interfaz `DomainEventPublisher` en shared-kernel diseñada para ser intercambiable por un broker real (Redis/RabbitMQ) en el futuro.

## Alternativas Consideradas

1. **Redis/RabbitMQ desde el inicio:** Sobrecarga operativa innecesaria para un monolito; complejidad adicional en docker-compose.
2. **Llamadas directas entre servicios:** Acopla los BCs, viola las reglas de comunicación.

## Consecuencias

- ✅ Cero dependencias externas para eventos
- ✅ Rápido y simple para desarrollo local
- ✅ Interfaz intercambiable (DomainEventPublisher) permite migrar a broker real sin cambiar dominio
- ❌ No persiste eventos entre reinicios (mitigado por Outbox Pattern en flujos críticos)

## Referencias

- AGENTS.md §2: "Pub/Sub — Comunicación entre Bounded Contexts desacoplados se hace vía eventos"
- DECISIONS.md: Decisión 5