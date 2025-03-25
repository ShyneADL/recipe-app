import {
  createAccount,
  login,
  googleAuth,
  getCurrentUser,
  logout,
} from "./appwrite";
import { Account, Client } from "appwrite";
import { Models } from "appwrite";

// Mock Appwrite
jest.mock("appwrite");

describe("Authentication Functions", () => {
  let mockAccount: jest.Mocked<Account>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create mock functions for all Account methods we use
    const mockFunctions = {
      create: jest.fn(),
      createSession: jest.fn(),
      createOAuth2Session: jest.fn(),
      get: jest.fn(),
      deleteSession: jest.fn(),
    };

    // Setup mock account with the mock functions
    mockAccount = mockFunctions as unknown as jest.Mocked<Account>;

    // Mock the Client constructor and its methods
    const MockClient = jest.fn(() => ({
      setEndpoint: jest.fn().mockReturnThis(),
      setProject: jest.fn().mockReturnThis(),
    }));

    // Replace the original Client with our mock
    (Client as unknown as jest.Mock) = MockClient;

    // Mock window.location for OAuth tests
    const mockWindow = {
      location: {
        origin: "http://localhost:3000",
        href: "",
      },
    };
    global.window = mockWindow as unknown as Window & typeof globalThis;
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
      mockAccount.create.mockResolvedValue(mockUser);

      const result = await createAccount(
        "test@example.com",
        "password123",
        "Test User"
      );

      expect(result).toEqual(mockUser);
      expect(mockAccount.create).toHaveBeenCalledWith(
        "unique()",
        "test@example.com",
        "password123",
        "Test User"
      );
    });

    it("should throw an error when account creation fails", async () => {
      const error = new Error("Account creation failed");
      mockAccount.create.mockRejectedValue(error);

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
      mockAccount.createSession.mockResolvedValue(mockSession);

      const result = await login("test@example.com", "password123");

      expect(result).toEqual(mockSession);
      expect(mockAccount.createSession).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    it("should throw an error when login fails", async () => {
      const error = new Error("Invalid credentials");
      mockAccount.createSession.mockRejectedValue(error);

      await expect(login("test@example.com", "wrong-password")).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("googleAuth", () => {
    it("should initiate Google OAuth session", async () => {
      mockAccount.createOAuth2Session.mockReturnValue("");

      await googleAuth();

      expect(mockAccount.createOAuth2Session).toHaveBeenCalledWith(
        "google",
        "http://localhost:3000/",
        "http://localhost:3000/login"
      );
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
      mockAccount.get.mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAccount.get).toHaveBeenCalled();
    });

    it("should return null when not authenticated", async () => {
      mockAccount.get.mockRejectedValue(new Error("Not authenticated"));

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(mockAccount.get).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockAccount.deleteSession.mockResolvedValue({});

      await logout();

      expect(mockAccount.deleteSession).toHaveBeenCalledWith("current");
    });

    it("should throw an error when logout fails", async () => {
      const error = new Error("Logout failed");
      mockAccount.deleteSession.mockRejectedValue(error);

      await expect(logout()).rejects.toThrow("Logout failed");
    });
  });
});
