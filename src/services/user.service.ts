import { userRepository } from "../repositories/user.repository";

/**
 * Service class to handle user-related operations.
 */
class UserService {
  /**
   * Find a user by their ID.
   * @param id - The user's ID.
   * @returns The user object or null.
   */
  async findUserById(id: string) {
    return await userRepository.findUserById(id);
  }
}

export const userService = new UserService();
