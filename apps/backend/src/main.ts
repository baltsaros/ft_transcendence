import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import { WsAdapter } from '@nestjs/platform-ws';
import * as session from "express-session";
import * as passport from "passport";

async function bootstrap() {
  console.log('Starting NestJS server...');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.enableCors();
  app.use(
    session({
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      secret: "asd",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
