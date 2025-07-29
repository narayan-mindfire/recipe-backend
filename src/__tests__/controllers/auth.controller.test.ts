// __tests__/controllers/auth.controller.test.ts
import { registerUser } from "../../controllers/auth.controller";
import { authService } from "../../services/auth.service";
import httpMocks from "node-mocks-http";

jest.mock("../../services/auth.service");

describe("Auth Controller - registerUser", () => {
  const mockUser = {
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    password: "pass123",
  };

  it("should register a user and return tokens", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: mockUser,
    });
    const res = httpMocks.createResponse();

    const mockAccessToken = "access-token";
    const mockRefreshToken = "refresh-token";

    (authService.register as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });

    await registerUser(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();

    expect(data.accessToken).toBe(mockAccessToken);
    expect(data.user.email).toBe("john@example.com");
  });

  it("should handle errors and return 400", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {},
    });
    const res = httpMocks.createResponse();

    (authService.register as jest.Mock).mockRejectedValue(
      new Error("Invalid input"),
    );

    await registerUser(req, res);

    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.message).toBe("Invalid input");
  });
});
