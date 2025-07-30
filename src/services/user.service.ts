import { userRepository } from "../repositories/user.repository";

class UserService {
  async findUserById(id: string) {
    return await userRepository.findUserById(id);
  }
}

export const userService = new UserService();
