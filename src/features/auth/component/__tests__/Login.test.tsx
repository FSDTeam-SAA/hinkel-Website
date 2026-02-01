import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import { useLogin } from "../../hooks/uselogin";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the hooks and navigation
jest.mock("../../hooks/uselogin");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("Login Component", () => {
  const mockHandleLogin = jest.fn();
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLogin as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      handleLogin: mockHandleLogin,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("renders the login form correctly", () => {
    render(<Login />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(
      /email address/i,
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls handleLogin and redirects on success", async () => {
    mockHandleLogin.mockResolvedValue({ error: null });
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      // Default callback is "/"
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message when login fails", () => {
    (useLogin as jest.Mock).mockReturnValue({
      loading: false,
      error: "Invalid credentials",
      handleLogin: mockHandleLogin,
    });

    render(<Login />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables button while loading", () => {
    (useLogin as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      handleLogin: mockHandleLogin,
    });

    render(<Login />);
    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();
  });
});
