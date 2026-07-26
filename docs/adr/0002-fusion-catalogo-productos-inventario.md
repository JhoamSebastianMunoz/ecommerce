# ADR 0002: Fusión de Productos e Inventario en Catálogo

## Contexto

La prueba técnica original lista "Productos" e "Inventario" como dominios separados. Sin embargo, en un sistema e-commerce, el producto y su disponibilidad de stock son conceptos profundamente acoplados: el stock es una propiedad del producto, y cualquier cambio en el stock debe ser transaccionalmente consistente con el estado del producto.

## Decisión

Fusionar "Productos" e "Inventario" en un único **Bounded Context: Catálogo**, con `Product` como Aggregate Root que incluye la gestión de stock.

## Alternativas Consideradas

1. **Productos e Inventario como contextos separados:** Requeriría consistencia eventual entre ellos, complicando operaciones como "verificar stock antes de agregar al carrito". Cada operación de stock requeriría una transacción distribuida o evento asíncrono, introduciendo race conditions.

2. **Productos como contexto, Inventario como sub-sistema:** Añade complejidad de integración sin beneficio claro, ya que el stock es una propiedad inherente del producto.

## Consecuencias

- ✅ Consistencia transaccional garantizada para operaciones de stock
- ✅ Simplificación del modelo de dominio
- ✅ Menos puntos de comunicación entre contextos
- ❌ No se puede escalar el inventario de forma independiente al catálogo (no requerido en el alcance actual)

## Referencias

- AGENTS.md §1: "Se decidió fusionarlos en un único Bounded Context (Catálogo) porque comparten la misma frontera de consistencia transaccional"
