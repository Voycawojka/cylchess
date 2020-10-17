import { ObjectType } from "@nestjs/graphql"
import { Field } from "@nestjs/graphql/dist/decorators/field.decorator"

@ObjectType()
export class VersionData {
    @Field()
    server: string

    @Field()
    logic: string
}
