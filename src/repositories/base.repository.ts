// repositories/base.repository.ts
import { Model, Types } from "mongoose";

export class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string) {
    return this.model.findById(new Types.ObjectId(id));
  }

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findAll(filter: Partial<Record<keyof T, T[keyof T]>> = {}) {
    return this.model.find(filter);
  }

  async update(id: string, data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
