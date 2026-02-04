import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register";
import { useRegister } from "../../hooks/useregister";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Mock the hooks
jest.mock("../../hooks/useregister");
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

  it("calls handleRegister and redirects on success", async () => {
    mockHandleRegister.mockResolvedValue({ error: null });
    render(<Register />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Check checkbox
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      // Name is capitalized in the component: "John Doe"
      expect(mockHandleRegister).toHaveBeenCalledWith(
        "John Doe",
        "test@example.com",
        "password123",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully!",
      );
      // Redirects to /login
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/login"));
    });
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
