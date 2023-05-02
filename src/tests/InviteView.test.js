import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InviteView from "../views/InviteView";
import userEvent from "@testing-library/user-event";

describe("InviteView", () => {
    const mockHandleConnect = jest.fn((username, roomId, setError) => {
        const usernameError = username.length >= 8 ? false : true;
        setError({ username: usernameError });
    });
    
    beforeEach(() => {
        mockHandleConnect.mockClear();
    });

    it("renders room number correctly", () => {
        const roomId = "123";
        render(
        <MemoryRouter initialEntries={[`/invite/${roomId}`]}>
            <Routes>
            <Route
                path="/invite/:room"
                element={<InviteView user={null} handleConnect={mockHandleConnect} />}
            />
            </Routes>
        </MemoryRouter>
        );
        expect(screen.getByText(`Connect to room #${roomId}`)).toBeInTheDocument();
    });

    it("renders user name if provided", () => {
        const user = { username: "John" };
        render(
        <MemoryRouter initialEntries={["/invite/123"]}>
            <Routes>
            <Route
                path="/invite/:room"
                element={<InviteView user={user} handleConnect={mockHandleConnect} />}
            />
            </Routes>
        </MemoryRouter>
        );
        expect(screen.getByDisplayValue(user.username)).toBeInTheDocument();
    });

    it("calls handleConnect with correct arguments on form submit", () => {
        const roomId = "123";
        const username = "John";
        render(
        <MemoryRouter initialEntries={[`/invite/${roomId}`]}>
            <Routes>
            <Route
                path="/invite/:room"
                element={<InviteView user={null} handleConnect={mockHandleConnect} />}
            />
            </Routes>
        </MemoryRouter>
        );
        const input = screen.getByRole("textbox", { name: "User" });
        userEvent.type(input, username);
        userEvent.click(screen.getByRole("button", { name: "Connect" }));
        expect(mockHandleConnect).toHaveBeenCalledWith(
        username,
        roomId,
        expect.any(Function)
        );
    });

    it("displays error message if username is too short", async () => {
        render(
        <MemoryRouter initialEntries={["/invite/123"]}>
            <Routes>
            <Route
                path="/invite/:room"
                element={<InviteView user={null} handleConnect={mockHandleConnect} />}
            />
            </Routes>
        </MemoryRouter>
        );
        const input = screen.getByRole("textbox", { name: "User" });
        userEvent.type(input, "a");
        userEvent.click(screen.getByRole("button", { name: "Connect" }));
        await waitFor(() => {
            setTimeout(() => {
                expect(screen.getByText("Error. Too short username")).toBeInTheDocument();
            }, 3000);
        });
    });
});