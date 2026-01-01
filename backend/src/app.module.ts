import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicController } from './public.controller';
import { SitesModule } from './sites/sites.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CreditsModule } from './credits/credits.module';
import { AuthModule } from './auth/auth.module';
import { ConfigController } from './config/config.controller';
import { ConfigService } from './config/config.service';
import { Site, SiteSchema } from './sites/schemas/site.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/testimonial-saas',
      }),
    }),
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    AuthModule,
    SitesModule,
    TestimonialsModule,
    AnalyticsModule,
    CreditsModule,
  ],
  controllers: [PublicController, AppController, ConfigController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
