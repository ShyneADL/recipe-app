import { Account, Client, ID, Models } from "appwrite";
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import {
  createAccount,
  login,
  googleAuth,
  logout,
  getCurrentUser,
} from "../appwrite";

// Mock the Appwrite modules
jest.mock("appwrite", () => ({
  Client: jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
  })),
  Account: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    createOAuth2Session: jest.fn(),
    get: jest.fn(),
    deleteSession: jest.fn(),
  })),
  ID: {
    unique: jest.fn().mockReturnValue("unique-id"),
  },
}));

describe("Authentication Functions", () => {
  let mockAccount: jest.Mocked<Account>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAccount = new Account(new Client()) as jest.Mocked<Account>;
  });

  describe("createAccount", () => {
    it("should create a new account successfully", async () => {
      const mockUser: Models.User<Models.Preferences> = {
        $id: "123",
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        name: "Test User",
        email: "test@example.com",
        phone: "",
        emailVerification: false,
        phoneVerification: false,
        status: true,
        passwordUpdate: new Date().toISOString(),
        registration: new Date().toISOString(),
        labels: [],
        prefs: {},
        accessedAt: new Date().toISOString(),
        mfa: false,
        targets: [],
      };
      mockAccount.create.mockResolvedValueOnce(mockUser);

      const result = await createAccount(
        "test@example.com",
        "password123",
        "Test User"
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw an error when account creation fails", async () => {
      const error = new Error("Account creation failed");
      mockAccount.create.mockRejectedValueOnce(error);

      await expect(
        createAccount("test@example.com", "password123", "Test User")
      ).rejects.toThrow("Account creation failed");
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const mockSession: Models.Session = {
        $id: "123",
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        userId: "123",
        expire: new Date().toISOString(),
        provider: "email",
        providerUid: "test@example.com",
        providerAccessToken: "",
        providerAccessTokenExpiry: "",
        providerRefreshToken: "",
        ip: "127.0.0.1",
        osCode: "WIN",
        osName: "Windows",
        osVersion: "10",
        clientType: "browser",
        clientCode: "CM",
        clientName: "Chrome",
        clientVersion: "",
        clientEngine: "blink",
        clientEngineVersion: "",
        deviceName: "desktop",
        deviceBrand: "",
        deviceModel: "",
        countryCode: "US",
        countryName: "United States",
        current: true,
        factors: [],
        secret: "",
        mfaUpdatedAt: new Date().toISOString(),
      };
      mockAccount.createEmailPasswordSession.mockResolvedValueOnce(mockSession);

      const result = await login("test@example.com", "password123");
      expect(result).toEqual(mockSession);
    });

    it("should handle login failure gracefully", async () => {
      mockAccount.createEmailPasswordSession.mockRejectedValueOnce(
        new Error("Invalid credentials")
      );

      const result = await login("test@example.com", "wrong-password");
      expect(result).toBeNull();
    });
  });

  describe("googleAuth", () => {
    const originalWindow = global.window;

    beforeEach(() => {
      global.window = {
        ...originalWindow,
        location: {
          ...originalWindow?.location,
          origin: "http://localhost:3000",
        },
      } as any;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it("should initiate Google OAuth session", async () => {
      const result = await googleAuth();
      expect(result).toBe(true);
      expect(mockAccount.createOAuth2Session).toHaveBeenCalledWith(
        "google",
        "http://localhost:3000/",
        "http://localhost:3000/login"
      );
    });

    it("should handle OAuth session creation failure", async () => {
      mockAccount.createOAuth2Session.mockImplementationOnce(() => {
        throw new Error("OAuth failed");
      });

      const result = await googleAuth();
      expect(result).toBe(false);
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockAccount.deleteSession.mockResolvedValueOnce({});

      const result = await logout();
      expect(result).toEqual({});
      expect(mockAccount.deleteSession).toHaveBeenCalledWith("current");
    });

    it("should handle logout failure", async () => {
      mockAccount.deleteSession.mockRejectedValueOnce(
        new Error("Logout failed")
      );

      const result = await logout();
      expect(result).toBe(false);
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      const mockUser: Models.User<Models.Preferences> = {
        $id: "123",
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        name: "Test User",
        email: "test@example.com",
        phone: "",
        emailVerification: false,
        phoneVerification: false,
        status: true,
        passwordUpdate: new Date().toISOString(),
        registration: new Date().toISOString(),
        labels: [],
        prefs: {},
        accessedAt: new Date().toISOString(),
        mfa: false,
        targets: [],
      };
      mockAccount.get.mockResolvedValueOnce(mockUser);

      const result = await getCurrentUser();
      expect(result).toEqual({
        ...mockUser,
        avatar: "T",
      });
    });

    it("should return null when not authenticated", async () => {
      mockAccount.get.mockRejectedValueOnce(new Error("Not authenticated"));

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });
  });
});
