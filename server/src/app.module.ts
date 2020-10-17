import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { VersioningModule } from './versioning/versioning.module'

@Module({
  imports: [
    GraphQLModule.forRoot({ autoSchemaFile: true, playground: true }),
    VersioningModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
