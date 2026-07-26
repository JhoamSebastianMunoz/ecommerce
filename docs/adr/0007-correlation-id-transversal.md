# ADR 0007: Correlation ID Transversal

## Contexto

Sin trazabilidad, debuggear un flujo asíncrono entre múltiples Bounded Contexts (Checkout → Pagos → Envíos) es prácticamente imposible. Las causas raíz de fallos pueden estar distribuidas a través de varios steps de la saga y múltiples eventos.

## Decisión

Propagar un `correlationId` único en toda request HTTP y en todo evento de dominio. Se genera en la entrada (middleware) y se propaga obligatoriamente a través de la Saga, eventos de dominio y Outbox.

## Alternativas Consideradas

1. **Sin correlation ID:** Imposible correlacionar logs y eventos entre contextos.
2. **Correlation ID solo en HTTP:** Los eventos asíncronos perderían la trazabilidad.

## Consecuencias

- ✅ Trazabilidad extremo a extremo para debugging y auditoría
- ✅ Posibilidad de reconstruir el recorrido completo de una operación
- ✅ Facilita la depuración de flujos asíncronos en la Saga
- ❌ Sobrecarga mínima en cada evento (un campo adicional correlationId)

## Referencias

- AGENTS.md §10: "Correlation ID / trazabilidad: toda request HTTP y todo evento de dominio propaga un correlationId único"
- DECISIONS.md: Decisión 7