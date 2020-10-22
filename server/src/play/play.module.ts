import { Module } from "@nestjs/common";
import { PlayResolver } from "./play.resolver";
import { PlayService } from "./play.service";

@Module({
    providers: [PlayService, PlayResolver],
    exports: [PlayService]
})
export class PlayModule {}
