import { Module } from "@nestjs/common"
import { VersioningResolver } from "./versioning.resolver"
import { VersioningService } from "./versioning.service"

@Module({
    providers: [VersioningService, VersioningResolver]
})
export class VersioningModule {}
