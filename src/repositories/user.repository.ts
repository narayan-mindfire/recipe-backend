import { UserModel } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { User } from "../zod/schemas";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }
  findUserById(id: string) {
    return this.model.findById(id).select("-password");
  }
}

export const userRepository = new UserRepository();
