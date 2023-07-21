import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend', 'dist'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
