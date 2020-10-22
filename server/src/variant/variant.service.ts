import { Injectable } from "@nestjs/common";
import { variants } from "cylchess-logic";
import { Board } from "cylchess-logic/dist/interface/Board";

@Injectable()
export class VariantService {

    createBoard(variantId: number): Board {
        return variants[variantId].createBoard()
    }
}
