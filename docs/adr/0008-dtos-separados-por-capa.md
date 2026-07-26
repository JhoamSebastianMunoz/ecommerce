# ADR 0008: DTOs Separados por Capa (Application vs HTTP)

## Contexto

Los casos de uso (application layer) requieren definir contratos de entrada/salida independientes del transporte. Los controladores HTTP necesitan decoradores de Swagger y class-validator propios de NestJS. Si se usara el mismo DTO para ambas capas, la aplicación quedaría acoplada a NestJS.

## Decisión

Mantener **DTOs de aplicación** (`application/dtos/`) y **DTOs HTTP** (`infrastructure/dtos/`) como archivos separados. El controlador mapea explícitamente del DTO HTTP al DTO de aplicación antes de invocar el caso de uso.

## Alternativas Consideradas

1. **DTO único compartido:** Acopla los casos de uso a decoradores de infraestructura (NestJS).
2. **DTO de aplicación con decoradores opcionales:** Mezcla responsabilidades; el DTO de aplicación deja de ser un contrato puro.

## Consecuencias

- ✅ Los casos de uso no dependen de NestJS ni HTTP
- ✅ Los DTOs HTTP pueden cambiar de formato sin afectar la lógica de negocio
- ✅ Validación separada por capa (class-validator en HTTP, reglas de dominio en use cases)
- ❌ Dos archivos por concepto en lugar de uno (duplicación estructural)

## Referencias

- AGENTS.md §3: "infrastructure/dtos y application/dtos son cosas distintas y NUNCA el mismo archivo"
- DECISIONS.md: Decisión 8