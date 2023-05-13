import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import RegisterView from "../../views/RegisterView";
import { BrowserRouter as Router } from 'react-router-dom';
import { LogoAnimationProvider } from '../../components/NavBar/LogoAnimationContext';

describe("RegisterView component", () => {
    it("submitting the form with valid data calls the handleRegister function", async () => {
        const handleRegisterMock = jest.fn();
        render(<RegisterView handleRegister={handleRegisterMock} />);

        // fill in form fields
        const usernameInput = screen.getByRole("textbox", { name: /user/i });
        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);

        await userEvent.type(usernameInput, "testuser");
        await userEvent.type(emailInput, "testuser@example.com");
        await userEvent.type(passwordInput, "password");

        // submit the form
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await userEvent.click(submitButton);

        // wait for the form submission to complete
        await waitFor(() => expect(handleRegisterMock).toHaveBeenCalled());
        expect(handleRegisterMock).toHaveBeenCalledWith(
            {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            },
            expect.any(Function),
            expect.any(Function)
        );
    });

    it("display an error message when username is too short", async () => {
        const handleRegisterMock = jest.fn((userNew, setError, setMessage) => {
            const validateUsername = userNew.username.length >= 8 ? false : true;
            setError((prev) => ({...prev, username: validateUsername}));
        });

        render(<RegisterView handleRegister={handleRegisterMock} />);

        // fill in form fields with invalid data
        const usernameInput = screen.getByRole("textbox", { name: /user/i });
        await userEvent.type(usernameInput, "a");

        // submit the form
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await userEvent.click(submitButton);

        // wait for error message to be displayed
        const errorMessage = await screen.findByText(/error. too short username/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("displays a success message after successful registration", async () => {
        const handleRegisterMock = jest.fn((userNew, setError, setMessage) => {
            setMessage({message: "Registration successful", successful: true, loading: false});
        });
        
        render(
            <LogoAnimationProvider>
                <Router>
                    <RegisterView handleRegister={handleRegisterMock} />
                </Router>
            </LogoAnimationProvider>
        );
        
        // fill in form fields with valid data
        const usernameInput = screen.getByRole("textbox", { name: /user/i });
        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);
        
        await userEvent.type(usernameInput, "testuser");
        await userEvent.type(emailInput, "testuser@example.com");
        await userEvent.type(passwordInput, "password");
        
        // submit the form
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await userEvent.click(submitButton);
        
        // wait for success message to be displayed
        const successMessage = await screen.findByText(/registration successful/i);
        expect(successMessage).toBeInTheDocument();
    });
  // more test cases...
});