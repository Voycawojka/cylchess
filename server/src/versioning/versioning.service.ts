import { Injectable } from "@nestjs/common"
import { VersionData } from "./versioning.model"
import { version as logicVersion } from "cylchess-logic"

@Injectable()
export class VersioningService {

    getVersionData(): VersionData {
        const data = new VersionData()
        
        data.server = process.env.npm_package_version ?? "_unknown_"
        data.logic = logicVersion

        return data
    }
}
