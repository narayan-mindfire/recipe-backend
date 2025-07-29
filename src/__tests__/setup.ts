import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST!, {
    dbName: "recipe_test",
  });
});

afterAll(async () => {
  //   await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
