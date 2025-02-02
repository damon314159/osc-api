import type { Collection, Course, NewCourse } from "../../../db/types.js";
import type { SortOrder } from "../../../types/common.js";
import type { Context } from "../../types.js";
import type { IFieldResolver, IResolvers } from "@graphql-tools/utils";

type AddCourseArgs = {
  input: NewCourse;
};

type UpdateCourseArgs = {
  id: number;
  input: Partial<NewCourse>;
};

type DeleteCourseArgs = {
  id: number;
};

export interface ICourseQueries extends IResolvers {
  Query: {
    courses: IFieldResolver<
      unknown,
      Context,
      { limit?: number; sortOrder?: SortOrder },
      Promise<Course[]>
    >;
    course: IFieldResolver<unknown, Context, { id: number }, Promise<Course>>;
  };

  Course: {
    collection: IFieldResolver<
      Course,
      Context,
      unknown,
      Promise<Collection | null>
    >;
  };
}

export interface ICourseMutations extends IResolvers {
  Mutation: {
    addCourse: IFieldResolver<unknown, Context, AddCourseArgs, Promise<Course>>;
    updateCourse: IFieldResolver<
      unknown,
      Context,
      UpdateCourseArgs,
      Promise<Course>
    >;
    deleteCourse: IFieldResolver<
      unknown,
      Context,
      DeleteCourseArgs,
      Promise<boolean>
    >;
  };
}

export interface ICourseResolvers extends ICourseQueries, ICourseMutations {}
