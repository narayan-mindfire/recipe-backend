import { RatingModel } from "../models/rating.model";
import { Rating } from "../zod/schemas";
import { BaseRepository } from "./base.repository";

class RatingRepository extends BaseRepository<Rating> {
  constructor() {
    super(RatingModel);
  }
}

export const ratingRepository = new RatingRepository();
