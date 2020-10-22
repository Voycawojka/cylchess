import { Module } from "@nestjs/common";
import { VariantService } from "./variant.service";

@Module({
    providers: [VariantService],
    exports: [VariantService]
})
export class VariantModule {}
