import { renderHook, act } from "@testing-library/react";
import { useLogin } from "../uselogin";
import { signIn } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("useLogin Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null, ok: true });

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin(
        "test@example.com",
        "password",
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(loginResult).toEqual({ error: null, ok: true });
    expect(signIn).toHaveBeenCalledWith("credentials", {
      redirect: false,
      email: "test@example.com",
      password: "password",
    });
  });

  it("should handle login error from signIn result", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin("test@example.com", "wrongpassword");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Invalid credentials");
  });

  it("should handle unexpected errors", async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin("test@example.com", "password");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Something went wrong");
  });
});
