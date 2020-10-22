import { Args, Int, Mutation, Resolver, Subscription } from "@nestjs/graphql"
import { ActionInput, BoardModel } from "./play.model";
import { PlayService } from "./play.service";

@Resolver(of => BoardModel)
export class PlayResolver {
    constructor(private readonly playService: PlayService) {
    }

    @Mutation(returns => Boolean)
    makeAction(
        @Args("playerId") playerId: string,
        @Args("action") action: ActionInput
    ): boolean {
        this.playService.makeAction(playerId, action)
        return true
    }

    @Subscription(returns => [BoardModel], {
        filter: (payload, variables) => payload.boardStateChanged.roomId === variables.roomId
    })
    boardStateChanged(@Args("roomId", { type: () => Int }) roomId: number) {
        return this.playService.boardStateChangedIterator()
    }
}
