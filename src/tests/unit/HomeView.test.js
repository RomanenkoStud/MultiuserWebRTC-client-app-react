import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import userEvent from '@testing-library/user-event';
import HomeView from '../../views/HomeView';
import { BrowserRouter as Router } from "react-router-dom";
import { LogoAnimationProvider } from "../../components/NavBar/LogoAnimationContext";

describe('HomeView', () => {

    const scrollIntoViewMock = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    it('should render the welcome message', () => {
        render(
        <LogoAnimationProvider>
            <Router>
                <HomeView />
            </Router>
        </LogoAnimationProvider>
        );
        const welcomeMessage = screen.getByRole('heading', { name: /welcome to roomconnect!/i });
        expect(welcomeMessage).toBeInTheDocument();
    });

    it('should show additional info when the "Show more" button is clicked', () => {
        render(
        <LogoAnimationProvider>
            <Router>
                <HomeView />
            </Router>
        </LogoAnimationProvider>
        );
        const showMoreButton = screen.getByRole('button', { name: /show more/i });
        userEvent.click(showMoreButton);
        const featuresHeader = screen.getByRole('heading', { name: /features/i });
        expect(featuresHeader).toBeInTheDocument();
    });

    it('should hide additional info when the "Hide" button is clicked', () => {
        render(
            <LogoAnimationProvider>
                <Router>
                    <HomeView />
                </Router>
            </LogoAnimationProvider>
        );
        const showMoreButton = screen.getByRole('button', { name: /show more/i });
        userEvent.click(showMoreButton);
        const hideButton = screen.getByRole('button', { name: /hide/i });
        userEvent.click(hideButton);
        const featuresHeader = screen.queryByRole('heading', { name: /features/i });
        expect(featuresHeader).not.toBeInTheDocument();
    });

  // add more tests here
});