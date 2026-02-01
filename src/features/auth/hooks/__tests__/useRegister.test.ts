import { renderHook, act } from "@testing-library/react";
import { useRegister } from "../useregister";
import { registeruser } from "../../api/register.api";
import { isAxiosError } from "axios";

jest.mock("../../api/register.api");
jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
    })),
  },
  isAxiosError: jest.fn(),
}));

describe("useRegister Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful registration", async () => {
    (registeruser as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.handleRegister(
        "John Doe",
        "john@example.com",
        "password",
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(registerResult).toEqual({ success: true });
    expect(registeruser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    });
  });

  it("should handle registration error (Axios error)", async () => {
    const mockError = {
      response: {
        data: {
          message: "Email already exists",
        },
      },
    };
    (registeruser as jest.Mock).mockRejectedValue(mockError);
    (isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(
        "John Doe",
        "john@example.com",
        "password",
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Email already exists");
  });

  it("should handle unexpected errors", async () => {
    (registeruser as jest.Mock).mockRejectedValue(new Error("Network error"));
    (isAxiosError as unknown as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleRegister(
        "John Doe",
        "john@example.com",
        "password",
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("An unexpected error occurred");
  });
});
