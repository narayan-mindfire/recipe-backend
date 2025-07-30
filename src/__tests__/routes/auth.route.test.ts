import request from "supertest";
import app from "../.."; // Adjust this path to your actual Express app entry point
import { UserModel } from "../../models/user.model";

let accessToken: string;
let refreshToken: string | undefined;
let userId: string;
const baseUrl = "/api/v1";
describe("Auth Routes", () => {
  const userPayload = {
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    password: "MyPassword123",
  };

  it("should register a new user", async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(userPayload)
      .expect(201);

    expect(res.body.user).toHaveProperty("_id");
    expect(res.body.user.email).toBe(userPayload.email);
    expect(res.body).toHaveProperty("accessToken");

    accessToken = res.body.accessToken;
    userId = res.body.user._id;

    const cookies = res.headers["set-cookie"] as unknown as string[];
    refreshToken = cookies
      ?.find((cookie) => cookie.startsWith("refreshToken"))
      ?.split(";")[0]
      .split("=")[1];

    if (!refreshToken) throw new Error("Refresh token not found");
  });

  it("should not register with duplicate email", async () => {
    await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(userPayload)
      .expect(400);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200);

    expect(res.body.user).toHaveProperty("_id");
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should fail login with wrong credentials", async () => {
    await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email: userPayload.email, password: "wrongpass" })
      .expect(400);
  });

  it("should get the logged in user profile", async () => {
    const res = await request(app)
      .get(`${baseUrl}/auth/me`)
      .set("Cookie", [`accessToken=${accessToken}`])
      .expect(200);

    expect(res.body.email).toBe(userPayload.email);
  });

  it("should update the user", async () => {
    const res = await request(app)
      .put(`${baseUrl}/auth/me`)
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({ bio: "Updated bio" })
      .expect(200);

    expect(res.body.user.bio).toBe("Updated bio");
  });

  it("should refresh the access token", async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/refresh-token`)
      .set("Cookie", [`refreshToken=${refreshToken}`])
      .expect(200);

    expect(
      (res.headers["set-cookie"] as unknown as string[]).some((cookie) =>
        cookie.startsWith("accessToken"),
      ),
    ).toBe(true);
  });

  it("should logout the user", async () => {
    const res = await request(app).post(`${baseUrl}/auth/logout`).expect(200);

    expect(res.body.message).toBe("Logged out successfully");
  });

  it("should delete the user", async () => {
    const _res = await request(app)
      .delete(`${baseUrl}/auth/me`)
      .set("Cookie", [`accessToken=${accessToken}`])
      .expect(204);

    const deleted = await UserModel.findById(userId);
    expect(deleted).toBeNull();
  });
});
