-- =============================================================================
-- E-COMMERCE SEED DATA SCRIPT (DDD + HEXAGONAL) - FIXED UUIDs
-- Target DB: PostgreSQL 14+
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. BOUNDED CONTEXT: CATÁLOGO (Categorías y Productos)
-- -----------------------------------------------------------------------------

INSERT INTO categories (id, name, slug) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tecnología', 'tecnologia'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Ropa y Moda', 'ropa-y-moda'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Hogar y Cocina', 'hogar-y-cocina')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, sku, name, description, price, stock, low_stock_threshold, status, category_id) VALUES 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'LPT-GAMER-01', 'Laptop Gamer Pro 15', 'Laptop de alto rendimiento con 32GB RAM y GPU RTX 4070', 1499.99, 15, 5, 'ACTIVE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c9bf9e57-1685-4c89-bafb-ff5af830be8a', 'MOU-WIRELESS-02', 'Mouse Inalámbrico Ergonómico', 'Mouse óptico recargable con conexión Bluetooth y 2.4G', 29.99, 50, 10, 'ACTIVE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'TSH-COTTON-01', 'Camiseta de Algodón Orgánico', 'Camiseta básica unisex 100% algodón', 19.50, 100, 15, 'ACTIVE', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'CAF-EXPRESS-01', 'Cafetera Espresso Automática', 'Cafetera italiana con molino integrado y espumador de leche', 349.00, 8, 3, 'ACTIVE', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33')
ON CONFLICT (id) DO NOTHING;


-- -----------------------------------------------------------------------------
-- 2. BOUNDED CONTEXT: CARRITO
-- -----------------------------------------------------------------------------

INSERT INTO carts (id, customer_id) VALUES 
('11111111-2222-3333-4444-555555555555', 'CUST-USR-001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (id, cart_id, product_id, quantity, unit_price) VALUES 
('aa11bb22-cc33-dd44-ee55-ff6677889900', '11111111-2222-3333-4444-555555555555', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 1499.99),
('bb22cc33-dd44-ee55-ff66-77889900aa11', '11111111-2222-3333-4444-555555555555', 'c9bf9e57-1685-4c89-bafb-ff5af830be8a', 2, 29.99)
ON CONFLICT (id) DO NOTHING;


-- -----------------------------------------------------------------------------
-- 3. BOUNDED CONTEXT: PROMOCIONES
-- -----------------------------------------------------------------------------

INSERT INTO promotions (id, code, description, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active) VALUES 
('11111111-1111-1111-1111-111111111111', 'DESCUENTO10', '10% de descuento en compras superiores a $100', 'PERCENTAGE', 10.00, 100.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', TRUE),
('22222222-2222-2222-2222-222222222222', 'BIENVENIDA20', 'Descuento fijo de $20 USD en tu primera compra', 'FIXED_AMOUNT', 20.00, 50.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', TRUE)
ON CONFLICT (id) DO NOTHING;


-- -----------------------------------------------------------------------------
-- 4. BOUNDED CONTEXT: CHECKOUT & ÓRDENES
-- -----------------------------------------------------------------------------

INSERT INTO orders (id, customer_id, cart_id, idempotency_key, status, total_amount, discount_amount, shipping_street, shipping_city, shipping_state, shipping_postal_code, shipping_country) VALUES 
('99999999-8888-7777-6666-555555555555', 'CUST-USR-001', '11111111-2222-3333-4444-555555555555', 'IK-ORDER-INIT-001', 'CONFIRMED', 1559.97, 0.00, 'Calle 100 #15-20', 'Bogotá', 'Cundinamarca', '110111', 'CO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES 
('11111111-2222-3333-4444-555555555501', '99999999-8888-7777-6666-555555555555', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 1499.99),
('22222222-3333-4444-5555-666666666602', '99999999-8888-7777-6666-555555555555', 'c9bf9e57-1685-4c89-bafb-ff5af830be8a', 2, 29.99)
ON CONFLICT (id) DO NOTHING;


-- -----------------------------------------------------------------------------
-- 5. BOUNDED CONTEXT: ENVÍOS
-- -----------------------------------------------------------------------------

INSERT INTO shipments (id, order_id, tracking_number, street, city, state, postal_code, country, status, shipped_at) VALUES 
('33333333-4444-5555-6666-777777777777', '99999999-8888-7777-6666-555555555555', 'TRK-2026-98765', 'Calle 100 #15-20', 'Bogotá', 'Cundinamarca', '110111', 'CO', 'IN_TRANSIT', NOW())
ON CONFLICT (id) DO NOTHING;


-- -----------------------------------------------------------------------------
-- 6. INFRAESTRUCTURA Y PATRONES (Outbox, Saga Log, Event Store)
-- -----------------------------------------------------------------------------

-- Pattern: Outbox Messages
INSERT INTO outbox_messages (id, aggregate_type, aggregate_id, type, payload, correlation_id, processed_at) VALUES 
('44444444-5555-6666-7777-888888888801', 'Order', '99999999-8888-7777-6666-555555555555', 'OrderPlacedEvent', '{"orderId": "99999999-8888-7777-6666-555555555555", "totalAmount": 1559.97}', 'CORR-ID-001-XYZ', NOW()),
('44444444-5555-6666-7777-888888888802', 'Product', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ProductCreatedEvent', '{"productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "sku": "LPT-GAMER-01"}', 'CORR-ID-002-XYZ', NOW())
ON CONFLICT (id) DO NOTHING;

-- Pattern: Saga Orchestration Log
INSERT INTO saga_log (id, saga_id, saga_type, step_name, status, payload, correlation_id) VALUES 
('55555555-6666-7777-8888-999999999901', '99999999-8888-7777-6666-555555555555', 'CheckoutSaga', 'ValidateStock', 'COMPLETED', '{"status": "OK"}', 'CORR-ID-001-XYZ'),
('55555555-6666-7777-8888-999999999902', '99999999-8888-7777-6666-555555555555', 'CheckoutSaga', 'ReserveStock', 'COMPLETED', '{"reserved": true}', 'CORR-ID-001-XYZ'),
('55555555-6666-7777-8888-999999999903', '99999999-8888-7777-6666-555555555555', 'CheckoutSaga', 'ProcessPayment', 'COMPLETED', '{"paymentId": "PAY-88888"}', 'CORR-ID-001-XYZ'),
('55555555-6666-7777-8888-999999999904', '99999999-8888-7777-6666-555555555555', 'CheckoutSaga', 'CreateShipment', 'COMPLETED', '{"trackingNumber": "TRK-2026-98765"}', 'CORR-ID-001-XYZ')
ON CONFLICT (id) DO NOTHING;

-- Pattern: Event Sourcing Store (PAGOS)
INSERT INTO payment_events (id, aggregate_id, event_type, version, payload, metadata) VALUES 
(uuid_generate_v4(), 'PAY-88888', 'PaymentInitiatedEvent', 1, '{"paymentId": "PAY-88888", "amount": 1559.97, "method": "CREDIT_CARD"}', '{"correlationId": "CORR-ID-001-XYZ"}'),
(uuid_generate_v4(), 'PAY-88888', 'PaymentAuthorizedEvent', 2, '{"paymentId": "PAY-88888", "authorizationCode": "AUTH-9912"}', '{"correlationId": "CORR-ID-001-XYZ"}'),
(uuid_generate_v4(), 'PAY-88888', 'PaymentCapturedEvent', 3, '{"paymentId": "PAY-88888", "status": "SUCCESS"}', '{"correlationId": "CORR-ID-001-XYZ"}')
ON CONFLICT (id) DO NOTHING;

-- Pattern: Event Sourcing Store (DEVOLUCIONES)
INSERT INTO return_events (id, aggregate_id, event_type, version, payload, metadata) VALUES 
(uuid_generate_v4(), 'RET-10001', 'ReturnRequestedEvent', 1, '{"returnId": "RET-10001", "orderId": "99999999-8888-7777-6666-555555555555", "reason": "Producto defectuoso"}', '{"correlationId": "CORR-ID-RET-001"}'),
(uuid_generate_v4(), 'RET-10001', 'ReturnApprovedEvent', 2, '{"returnId": "RET-10001", "approvedBy": "ADMIN-01"}', '{"correlationId": "CORR-ID-RET-001"}')
ON CONFLICT (id) DO NOTHING;