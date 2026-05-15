import { render, screen, fireEvent } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import Login from "../Login";
import { useLogin } from "../../hooks/uselogin";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the hooks and navigation
jest.mock("../../hooks/uselogin");
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => (
    <span data-testid="mock-next-image">{alt || ""}</span>
  ),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
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
