# ADR 0010: Shared Kernel para Clases Base Transversales

## Contexto

Los patrones DDD (AggregateRoot, Entity, ValueObject, DomainEvent) son transversales a todos los Bounded Contexts. Sin una base común, cada contexto los implementaría de forma diferente, generando inconsistencia y duplicación.

## Decisión

Crear una carpeta `shared-kernel/` con las clases base de DDD (AggregateRoot, Entity, ValueObject, DomainEvent) y utilidades verdaderamente transversales (CorrelationId, Health, UUIDs). Todos los BCs heredan de estas bases compartidas.

## Alternativas Consideradas

1. **Duplicar en cada BC:** Inconsistencia entre implementaciones, viola DRY.
2. **Clases base dentro de @nestjs/common:** Acopla el dominio a NestJS.

## Consecuencias

- ✅ Consistencia en la implementación de patrones DDD en todo el proyecto
- ✅ Un solo punto de cambio para correcciones o mejoras
- ✅ Las clases base no tienen dependencias de infraestructura
- ❌ Riesgo de mezclar código transversal con código específico de BC (mitigado por revisión de estructura)

## Referencias

- AGENTS.md §3: "shared-kernel/ — tipos, IDs, eventos base, correlation-id middleware y utilidades verdaderamente transversales"
- DECISIONS.md: Decisión 10