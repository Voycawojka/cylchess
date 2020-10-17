import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RoomModule } from './room/room.module'
import { VersioningModule } from './versioning/versioning.module'

@Module({
  imports: [
    GraphQLModule.forRoot({ 
      autoSchemaFile: true, 
      playground: true,
      installSubscriptionHandlers: true
    }),
    VersioningModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
