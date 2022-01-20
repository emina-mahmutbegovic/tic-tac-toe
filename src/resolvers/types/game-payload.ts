import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class GamePayload {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  message?: string;
}
