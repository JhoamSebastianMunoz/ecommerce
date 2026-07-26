# ADR 0009: Entidades TypeORM Separadas de Entidades de Dominio

## Contexto

TypeORM requiere decoradores (`@Entity`, `@Column`, `@ManyToOne`) en las clases que mapean a tablas. Si las entidades de dominio usaran estos decoradores, el dominio quedaría acoplado a TypeORM, violando la arquitectura hexagonal.

## Decisión

Las entidades de dominio (`domain/entities/`) son clases planas (POJO) sin decoradores. Las entidades de TypeORM (`infrastructure/db/entities/`) son clases separadas con decoradores `@Entity`, `@Column`, etc. Un **Mapper** explícito convierte entre ambos mundos.

## Alternativas Consideradas

1. **Entidades de dominio con decoradores:** Acopla el dominio a TypeORM; cambiar de ORM requeriría modificar el dominio.
2. **Sin TypeORM (query builders directos):** Mayor complejidad de mantenimiento, perder las ventajas del ORM.

## Consecuencias

- ✅ Dominio puro sin dependencias de infraestructura
- ✅ Flexibilidad para cambiar de ORM sin tocar el dominio
- ✅ Mapeo explícito y auditable entre ambos mundos
- ❌ Código boilerplate de mappers entre entidades de dominio y persistencia

## Referencias

- AGENTS.md §3: "infrastructure/db contiene el modelo de persistencia; la entidad de dominio en domain/entities es un objeto plano sin decoradores de ORM"
- DECISIONS.md: Decisión 9