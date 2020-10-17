import { Injectable } from "@nestjs/common"
import { VersionData } from "./versioning.model"

@Injectable()
export class VersioningService {

    getVersionData(): VersionData {
        const data = new VersionData()
        
        data.server = "0.0.1"
        data.logic = "???"

        return data
    }
}
