# ADR 0011: Money como Value Object Compartido en Shared Kernel

## Contexto

El Value Object `Money` es usado por múltiples Bounded Contexts (Catálogo para precios de productos, Carrito para precios unitarios y totales). Originalmente residía en Catálogo, pero Carrito necesitaba importarlo directamente de otro BC, violando las reglas de comunicación entre contextos.

## Decisión

Mover `Money` de `catalogo/domain/value-objects/` a `shared-kernel/domain/base/Money.ts`. Catálogo reexporta desde shared-kernel para mantener compatibilidad con imports existentes.

## Alternativas Consideradas

1. **Duplicar Money en cada BC:** Riesgo de inconsistencias en cálculos monetarios (redondeo, precisión).
2. **Definir un puerto ACL para Money:** Sobredimensionado para un Value Object puramente conceptual.

## Consecuencias

- ✅ Elimina dependencia cruzada entre BCs
- ✅ Todos los BCs usan la misma implementación de Money (consistencia)
- ✅ Sigue el principio DRY
- ✅ Catálogo reexporta para mantener compatibilidad hacia atrás
- ❌ Money ahora es compartido, cualquier cambio afecta a múltiples BCs (mitigado por ser un VO inmaduro)

## Referencias

- AGENTS.md §3: "shared-kernel/ — tipos, IDs, eventos base"
- DECISIONS.md: Decisión 11