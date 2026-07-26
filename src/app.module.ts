import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './shared-kernel/infrastructure/health/health.controller';
import { CorrelationIdMiddleware } from './shared-kernel/infrastructure/middleware/correlation-id.middleware';
import { loadConfiguration, validateEnv } from './config/configuration';
import { typeOrmConfig } from './database/data-source';

validateEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfiguration],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    EventEmitterModule.forRoot({
      wildcard: false,
    }),
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
