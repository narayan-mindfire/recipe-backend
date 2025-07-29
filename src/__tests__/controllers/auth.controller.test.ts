import httpMocks from "node-mocks-http";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  editMe,
  deleteMe,
} from "../../controllers/auth.controller";
import { authService } from "../../services/auth.service";
import { AuthRequest } from "../../types/types";

jest.mock("../../services/auth.service");

const mockUser = {
  fname: "John",
  lname: "Doe",
  email: "john@example.com",
  password: "pass123",
};

describe("Auth Controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("registerUser", () => {
    it("should register a user and return tokens", async () => {
      const req = httpMocks.createRequest({ method: "POST", body: mockUser });
      const res = httpMocks.createResponse();

      (authService.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });

      await registerUser(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().accessToken).toBe("access-token");
    });

    it("should return 400 on error", async () => {
      const req = httpMocks.createRequest({ method: "POST", body: {} });
      const res = httpMocks.createResponse();

      (authService.register as jest.Mock).mockRejectedValue(
        new Error("Invalid input"),
      );

      await registerUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Invalid input");
    });
  });

  describe("loginUser", () => {
    it("should login a user and return tokens", async () => {
      const req = httpMocks.createRequest({ method: "POST", body: mockUser });
      const res = httpMocks.createResponse();

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });

      await loginUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().accessToken).toBe("access-token");
    });

    it("should return 400 on login error", async () => {
      const req = httpMocks.createRequest({ method: "POST", body: {} });
      const res = httpMocks.createResponse();

      (authService.login as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials"),
      );

      await loginUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Invalid credentials");
    });
  });

  describe("refreshToken", () => {
    it("should return new access token", async () => {
      const req = httpMocks.createRequest({
        cookies: { refreshToken: "valid-token" },
      });
      const res = httpMocks.createResponse();

      (authService.refresh as jest.Mock).mockResolvedValue({
        accessToken: "new-access-token",
      });

      await refreshToken(req, res);

      expect(res.statusCode).toBe(200);
    });

    it("should return 401 if no token", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await refreshToken(req, res);
      expect(res.statusCode).toBe(401);
    });
  });

  describe("logoutUser", () => {
    it("should clear cookies and logout", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await logoutUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe("Logged out successfully");
    });
  });

  describe("getMe", () => {
    it("should return user data", async () => {
      const req = httpMocks.createRequest<AuthRequest>({
        user: { id: "123" },
      });
      const res = httpMocks.createResponse();

      (authService.me as jest.Mock).mockResolvedValue({ fname: "John" });

      await getMe(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().fname).toBe("John");
    });
  });

  describe("editMe", () => {
    it("should update and return user", async () => {
      const req = httpMocks.createRequest<AuthRequest>({
        user: { id: "123" },
        body: { fname: "Updated" },
      });
      const res = httpMocks.createResponse();

      (authService.editMe as jest.Mock).mockResolvedValue({ fname: "Updated" });

      await editMe(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().user.fname).toBe("Updated");
    });
  });

  describe("deleteMe", () => {
    it("should delete user and return 204", async () => {
      const req = httpMocks.createRequest<AuthRequest>({ user: { id: "123" } });
      const res = httpMocks.createResponse();

      (authService.deleteMe as jest.Mock).mockResolvedValue(undefined);

      await deleteMe(req, res);

      expect(res.statusCode).toBe(204);
    });
  });
});
