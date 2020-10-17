import { Query, Resolver } from "@nestjs/graphql"
import { VersionData } from "./versioning.model"
import { VersioningService } from "./versioning.service"

@Resolver(of => VersionData)
export class VersioningResolver {
    constructor(private versioningService: VersioningService) {
    }

    @Query(returns => VersionData, { description: "Cylchess packages versions on the server used by clients to make sure their versions match." })
    versionData() {
        return this.versioningService.getVersionData()
    }
}
