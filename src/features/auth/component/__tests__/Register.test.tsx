import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import Register from "../Register";
import { useRegister } from "../../hooks/useregister";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the hooks
jest.mock("../../hooks/useregister");
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
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("Register Component", () => {
  const mockHandleRegister = jest.fn();
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRegister as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      handleRegister: mockHandleRegister,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("renders the register form correctly", () => {
    render(<Register />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("displays error message when registration fails", () => {
    (useRegister as jest.Mock).mockReturnValue({
      loading: false,
      error: "Registration failed",
      handleRegister: mockHandleRegister,
    });

    render(<Register />);
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });
});
