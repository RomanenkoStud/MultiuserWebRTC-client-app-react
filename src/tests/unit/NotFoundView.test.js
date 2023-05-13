import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { LogoAnimationProvider } from '../../components/NavBar/LogoAnimationContext';
import NotFoundView from '../../views/NotFoundView';

describe('NotFoundView', () => {
    it('should display 404 heading', () => {
        render(
        <LogoAnimationProvider>
            <Router>
                <NotFoundView />
            </Router>
        </LogoAnimationProvider>
        );

        const heading = screen.getByText('404');
        expect(heading).toBeInTheDocument();
    });

    it('should display link to home page', () => {
        render(
        <LogoAnimationProvider>
            <Router>
                <NotFoundView />
            </Router>
        </LogoAnimationProvider>
        );

        const link = screen.getByRole('link', { name: 'Home' });
        expect(link).toHaveAttribute('href', '/');
    });
});