import { Injectable } from "@nestjs/common"
import { VersionData } from "./versioning.model"
import { variants } from "cylchess-logic"

@Injectable()
export class VersioningService {

    getVersionData(): VersionData {
        const data = new VersionData()
        
        data.server = process.env.npm_package_version
        data.logic = variants.get(0).name

        return data
    }
}
