import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class VersionData {
    @Field()
    server: string

    @Field()
    logic: string
}
