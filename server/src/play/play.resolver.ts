import { Args, Int, Resolver, Subscription } from "@nestjs/graphql"
import { List } from "immutable";
import { BoardModel } from "./play.model";
import { PlayService } from "./play.service";

@Resolver(of => BoardModel)
export class PlayResolver {
    constructor(private readonly playService: PlayService) {
    }

    @Subscription(returns => [BoardModel], {
        filter: (payload, variables) => payload.boardStateChanged.roomId === variables.roomId
    })
    boardStateChanged(@Args("roomId", { type: () => Int }) roomId: number) {
        return this.playService.boardStateChangedIterator()
    }
}
