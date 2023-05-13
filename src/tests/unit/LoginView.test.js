import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import LoginView from "../../views/LoginView";
import { BrowserRouter as Router } from "react-router-dom";
import { LogoAnimationProvider } from "../../components/NavBar/LogoAnimationContext";
import { useAuth } from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth", () => ({
    useAuth: jest.fn(),
}));

describe("LoginView", () => {
    it("calls handleLogin with user credentials when the form is submitted", () => {
        const handleLoginMock = jest.fn();
        useAuth.mockReturnValue({
        handleLogin: handleLoginMock,
        });
        render(
        <LogoAnimationProvider>
            <Router>
            <LoginView />
            </Router>
        </LogoAnimationProvider>
        );

        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByText("Submit");

        userEvent.type(emailInput, "test@example.com");
        userEvent.type(passwordInput, "password123");
        userEvent.click(submitButton);

        expect(handleLoginMock).toHaveBeenCalledWith(
            {
                email: "test@example.com",
                password: "password123",
            },
            expect.any(Function),
            expect.any(Function)
        );
    });

    it("displays an error message when user submits an empty form", () => {
        const handleLoginMock = jest.fn((user, setError, setMessage) => {
            const validateEmail = user.email.length >= 8 ? false : true;
            const validatePassword = user.password.length >= 8 ? false : true;
            setError({email: validateEmail, password: validatePassword});
        });
        useAuth.mockReturnValue({
        handleLogin: handleLoginMock,
        });
        render(
            <LogoAnimationProvider>
                <Router>
                    <LoginView />
                </Router>
            </LogoAnimationProvider>
        );
        const submitButton = screen.getByText("Submit");
        userEvent.click(submitButton);
        const emailErrorMessage = screen.getByText(/Error. Input is not email/i);
        const passwordErrorMessage = screen.getByText(/Error. Too short password/i);
        expect(emailErrorMessage).toBeInTheDocument();
        expect(passwordErrorMessage).toBeInTheDocument();
    });

    it("password input field should be hidden", () => {
        const handleLoginMock = jest.fn();
        useAuth.mockReturnValue({
            handleLogin: handleLoginMock,
        });
        render(
            <LogoAnimationProvider>
                <Router>
                <   LoginView />
                </Router>
            </LogoAnimationProvider>
        );
        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput.type).toBe("password");
    });
    
});