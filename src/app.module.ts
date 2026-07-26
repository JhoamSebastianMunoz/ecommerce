import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './shared-kernel/infrastructure/health/health.controller';
import { CorrelationIdMiddleware } from './shared-kernel/infrastructure/middleware/correlation-id.middleware';
import { loadConfiguration } from './config/configuration';
import { typeOrmConfig } from './database/data-source';
import { CatalogoModule } from './contexts/catalogo/catalogo.module';
import { CarritoModule } from './contexts/carrito/carrito.module';
import { PromocionesModule } from './contexts/promociones/promociones.module';
import { CheckoutModule } from './contexts/checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [loadConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [],
      useFactory: () => ({
        ...typeOrmConfig,
        autoLoadEntities: true,
      }),
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
    }),
    TerminusModule,
    CatalogoModule,
    CarritoModule,
    PromocionesModule,
    CheckoutModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
