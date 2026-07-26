# ADR 0003: Event Sourcing en Pagos y Devoluciones

## Contexto

Los Bounded Contexts de Pagos y Devoluciones requieren auditoría explícita del historial de estados para reconciliación contable y soporte al cliente. Los demás contextos (Catálogo, Carrito, Checkout, Promociones, Envíos) no tienen este requisito.

## Decisión

Aplicar **Event Sourcing exclusivamente** en los Bounded Contexts **Pagos** y **Devoluciones**. Los demás contextos usan persistencia state-oriented estándar (TypeORM con entidades).

## Alternativas Consideradas

1. **Event Sourcing en todos los contextos:** Introduce complejidad innecesaria donde no se requiere auditoría completa de estados.
2. **Sin Event Sourcing:** No permite reconstruir estado histórico de transacciones financieras y devoluciones.

## Consecuencias

- ✅ Trazabilidad completa de transacciones financieras y devoluciones
- ✅ Reconstrucción de estado ante disputas o auditorías
- ✅ Complejidad controlada (solo 2 de 7 contextos)
- ❌ Dos modelos de persistencia distintos en el mismo monolito
- ❌ Migraciones de esquema más estrictas (nunca `synchronize: true`)

## Referencias

- AGENTS.md §2: "Event Sourcing se aplica exclusivamente en los Bounded Contexts Pagos y Devoluciones"
- DECISIONS.md: Decisión 3