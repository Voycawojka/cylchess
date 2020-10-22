import { Module } from "@nestjs/common";
import { PlayModule } from "src/play/play.module";
import { VariantModule } from "src/variant/variant.module";
import { RoomResolver } from "./room.resolver";
import { RoomService } from "./room.service";

@Module({
    providers: [RoomService, RoomResolver],
    imports: [PlayModule, VariantModule]
})
export class RoomModule {}
