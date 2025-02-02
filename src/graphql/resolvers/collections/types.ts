import type { Collection, Course } from "../../../db/types.js";
import type { Context } from "../../types.js";
import type { IFieldResolver, IResolvers } from "@graphql-tools/utils";

export interface ICollectionQueries extends IResolvers {
  Query: {
    collections: IFieldResolver<
      unknown,
      Context,
      unknown,
      Promise<Collection[]>
    >;
    collection: IFieldResolver<
      unknown,
      Context,
      { id: number },
      Promise<Collection>
    >;
  };
  Collection: {
    courses: IFieldResolver<Collection, Context, unknown, Promise<Course[]>>;
  };
}

export type ICollectionResolvers = ICollectionQueries;
