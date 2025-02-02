import type { AuthResponse, DTOUser } from "../../../types/common.js";
import type { Context } from "../../types.js";
import type { IFieldResolver, IResolvers } from "@graphql-tools/utils";

type RegisterArgs = {
  username: string;
  password: string;
};

type LoginArgs = {
  username: string;
  password: string;
};

export interface IUserQueries extends IResolvers {
  Query: {
    me: IFieldResolver<unknown, Context, unknown, Promise<DTOUser>>;
  };
}

export interface IUserMutations extends IResolvers {
  Mutation: {
    register: IFieldResolver<
      unknown,
      Context,
      RegisterArgs,
      Promise<AuthResponse>
    >;
    login: IFieldResolver<unknown, Context, LoginArgs, Promise<AuthResponse>>;
  };
}

export interface IUserResolvers extends IUserQueries, IUserMutations {}
