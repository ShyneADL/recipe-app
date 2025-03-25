import { Client, Account, ID, OAuthProvider } from "appwrite";

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
};

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const account = new Account(client);

// Auth functions
export const createAccount = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    return response;
  } catch (error) {
    throw error;
  }
};

export async function login(email: string, password: string) {
  try {
    // First, try to delete any existing session
    try {
      await account.deleteSession("current");
    } catch (error) {
      // Ignore error if no session exists
    }

    // Create a new session
    const session = await account.createSession(email, password);

    // Get the user details
    const user = await account.get();

    return { session, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function googleAuth() {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      window.location.origin + "/",
      window.location.origin + "/login"
    );
  } catch (error) {
    console.error("Google auth error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await account.deleteSessions(); // Delete all sessions instead of just current
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return {
      ...user,
      avatar: user.name.charAt(0).toUpperCase(),
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
