import { Module } from "@nestjs/common";
import { PlayModule } from "src/play/play.module";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";

@Module({
    providers: [RoomService, RoomResolver],
    imports: [PlayModule]
})
export class RoomModule {}
