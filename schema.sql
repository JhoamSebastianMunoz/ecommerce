-- =============================================================================
-- E-COMMERCE DATABASE SCHEMA (DDD + HEXAGONAL)
-- Target DB: PostgreSQL 14+
-- =============================================================================

-- Clean up (Opcional en desarrollo)
-- DROP SCHEMA public CASCADE; CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. INFRASTRUCTURE & PATTERNS (Outbox & Saga Log)
-- -----------------------------------------------------------------------------

-- Pattern: Outbox Pattern (Garantiza consistencia transaccional y Pub/Sub)
CREATE TABLE outbox_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    correlation_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX idx_outbox_unprocessed ON outbox_messages(created_at) WHERE processed_at IS NULL;

-- Pattern: Saga Orchestration Log (Seguimiento de la Saga de Checkout)
CREATE TABLE saga_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    saga_id VARCHAR(100) NOT NULL,
    saga_type VARCHAR(100) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- STARTED, COMPLETED, FAILED, COMPENSATED
    payload JSONB,
    correlation_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saga_id ON saga_log(saga_id);

-- -----------------------------------------------------------------------------
-- 2. BOUNDED CONTEXT: CATÁLOGO (Productos, Categorías e Inventario)
-- -----------------------------------------------------------------------------

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. BOUNDED CONTEXT: CARRITO
-- -----------------------------------------------------------------------------

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(100) NOT NULL, -- O Identificador de sesión
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_cart_product UNIQUE (cart_id, product_id)
);

-- -----------------------------------------------------------------------------
-- 4. BOUNDED CONTEXT: PROMOCIONES
-- -----------------------------------------------------------------------------

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED_AMOUNT
    discount_value DECIMAL(12, 2) NOT NULL,
    min_purchase_amount DECIMAL(12, 2) DEFAULT 0.00,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. BOUNDED CONTEXT: CHECKOUT & ORDENES
-- -----------------------------------------------------------------------------

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(100) NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL, -- PENDING, STOCK_RESERVED, PAYMENT_PENDING, CONFIRMED, FAILED, CANCELLED
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 6. BOUNDED CONTEXT: PAGOS (Pattern: Event Sourcing Store)
-- -----------------------------------------------------------------------------

CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_id VARCHAR(100) NOT NULL, -- Payment ID
    event_type VARCHAR(100) NOT NULL,  -- PaymentInitiated, PaymentAuthorized, etc.
    version INT NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_payment_event_version UNIQUE (aggregate_id, version)
);

CREATE INDEX idx_payment_events_aggregate ON payment_events(aggregate_id);

-- -----------------------------------------------------------------------------
-- 7. BOUNDED CONTEXT: ENVÍOS
-- -----------------------------------------------------------------------------

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE,
    tracking_number VARCHAR(30) UNIQUE NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED', -- CREATED, IN_TRANSIT, DELIVERED, FAILED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- -----------------------------------------------------------------------------
-- 8. BOUNDED CONTEXT: DEVOLUCIONES (Pattern: Event Sourcing Store)
-- -----------------------------------------------------------------------------

CREATE TABLE return_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_id VARCHAR(100) NOT NULL, -- Return ID
    event_type VARCHAR(100) NOT NULL,  -- ReturnRequested, ReturnApproved, etc.
    version INT NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_return_event_version UNIQUE (aggregate_id, version)
);

CREATE INDEX idx_return_events_aggregate ON return_events(aggregate_id);