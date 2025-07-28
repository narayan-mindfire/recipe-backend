// repositories/auth.repository.ts
import { BaseRepository } from "./base.repository";
import { UserModel } from "../models/user.model";
import { User } from "../zod/schemas";

class AuthRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async editMe(id: string, newUser: Partial<User>) {
    return this.model.findByIdAndUpdate(id, newUser, {
      new: true,
      runValidators: true,
    });
  }
  async deleteMe(id: string) {
    await this.model.findByIdAndDelete(id);
  }
}

export const authRepository = new AuthRepository();
