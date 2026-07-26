# Domain Design Document

## 1. Bounded Contexts

| Contexto | Descripción | Aggregate Roots |
|---|---|---|
| **Catálogo** | Gestión de productos e inventario (fusionados) | Product |
| **Carrito** | Carrito de compras temporal | Cart |
| **Promociones** | Cupones y reglas de descuento | Promotion |
| **Checkout** | Proceso de orden y coordinación de flujos | Order |
| **Pagos** | Procesamiento de pagos (Event Sourcing) | Payment |
| **Envíos** | Gestión de envíos y tracking | Shipment |
| **Devoluciones** | Gestión de devoluciones (Event Sourcing) | Return |

## 2. Context Map

```
Catálogo <--(query)--> Carrito
Carrito <--(event)--> Promociones
Carrito <--(command)--> Checkout
Checkout -->(saga)--> Catálogo (reservar stock)
Checkout -->(saga)--> Pagos (procesar pago)
Checkout -->(saga)--> Envíos (crear envío)
Devoluciones -->(command)--> Pagos (reembolsar)
```

## 3. Decisiones de Diseño

### 3.1 Fusión de Productos e Inventario en Catálogo

**Justificación:** El `Product` y su disponibilidad de stock comparten la misma frontera de consistencia transaccional y el mismo lenguaje ubicuo. Ambos se modifican dentro del mismo Aggregate Root (`Product`), por lo que separarlos en contextos distintos introduciría una consistencia eventual innecesaria y complejidad de coordinación.

Ver: `docs/adr/0002-fusion-catalogo-productos-inventario.md`

### 3.2 Event Sourcing en Pagos y Devoluciones

**Justificación:** Estos contextos requieren auditoría explícita del historial de estados. Event Sourcing permite reconstruir el estado completo de una transacción financiera o devolución a partir de su historial de eventos inmutables, lo cual es crítico para reconciliación contable y soporte al cliente.

### 3.3 Saga Orquestada en Checkout

**Justificación:** El flujo de checkout implica múltiples contextos (Catálogo, Pagos, Envíos) con necesidad de compensación ante fallos. Una saga orquestada con un coordinador explícito (`CheckoutSaga`) proporciona visibilidad, control de timeouts y compensaciones ordenadas.

### 3.4 Money como Value Object compartido

**Justificación:** `Money` es un concepto de dominio usado por múltiples BCs (Catálogo y Carrito). Se movió a `shared-kernel` para evitar dependencias cruzadas entre BCs, manteniendo consistencia en cálculos monetarios.

### 3.5 Puerto ACL ProductQueryPort

**Justificación:** Carrito necesita validar stock y precios del Catálogo sin crear dependencia directa. Se definió `ProductQueryPort` en Carrito y `ProductQueryAdapter` en Catálogo, siguiendo el patrón Anti-Corruption Layer.

## 4. Eventos de Dominio

### Catálogo
- `ProductCreatedEvent`
- `StockAdjustedEvent`
- `StockLowWarningEvent`

### Carrito
- `CartItemAddedEvent`
- `CartItemRemovedEvent`
- `CartAbandonedEvent`

### Promociones
- `PromotionAppliedEvent`
- `PromotionExpiredEvent`

### Checkout
- `OrderPlacedEvent`
- `StockReservedEvent`
- `OrderConfirmedEvent`
- `OrderFailedEvent`
- `OrderCancelledEvent`

### Pagos (Event Sourced)
- `PaymentInitiatedEvent`
- `PaymentAuthorizedEvent`
- `PaymentCapturedEvent`
- `PaymentFailedEvent`
- `PaymentRefundedEvent`

### Envíos
- `ShipmentCreatedEvent`
- `ShipmentInTransitEvent`
- `ShipmentDeliveredEvent`
- `ShipmentFailedEvent`

### Devoluciones (Event Sourced)
- `ReturnRequestedEvent`
- `ReturnApprovedEvent`
- `ReturnRejectedEvent`
- `ReturnReceivedEvent`
- `RefundIssuedEvent`

## 5. Patrones Aplicados

| Patrón | Contextos |
|---|---|
| Repository | Todos |
| Domain Events | Todos |
| Hexagonal (Puertos/Adaptadores) | Todos |
| Saga Orquestada | Checkout |
| Outbox Pattern | Checkout |
| Pub/Sub | Todos (via EventEmitter2) |
| Event Sourcing | Pagos, Devoluciones |
| Idempotency | Checkout, Pagos |
| Correlation ID | Todos |

## 6. Patrones Descartados

| Patrón | Justificación |
|---|---|
| Event Sourcing en Catálogo/Carrito/Checkout/Promociones/Envíos | No requieren auditoría de estados. Introduciría complejidad innecesaria. |
| Saga Coreografiada | Menos visibilidad que la orquestada. La orquestada permite control de timeouts y compensaciones ordenadas. |
| CQRS separado | Para el alcance actual, los queries son simples. Se puede introducir en el futuro si se necesita escalar reads. |
