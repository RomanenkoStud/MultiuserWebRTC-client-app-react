import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AfterCallView from '../../views/AfterCallView';
import userEvent from '@testing-library/user-event';

describe('AfterCallView', () => {
    it('renders the "How was the call?" text', () => {
        render(<AfterCallView />);
        const textElement = screen.getByText(/How was the call?/i);
        expect(textElement).toBeInTheDocument();
    });

    it('renders the Rating component', () => {
        render(<AfterCallView />);
        const ratingElement = screen.getByTestId('rating');
        expect(ratingElement).toBeInTheDocument();
    });

    it('renders the "Submit Rating" button', () => {
        render(<AfterCallView />);
        const buttonElement = screen.getByRole('button', { name: /submit rating/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('calls onRating when the "Submit Rating" button is clicked', () => {
        const onRatingMock = jest.fn();
        render(<AfterCallView onRating={onRatingMock} />);
        const buttonElement = screen.getByRole('button', { name: /submit rating/i });
        userEvent.click(buttonElement);
        expect(onRatingMock).toHaveBeenCalled();
    });

    it('renders the "Return to Call" button', () => {
        render(<AfterCallView />);
        const buttonElement = screen.getByRole('button', { name: /return to call/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('calls handleReturn when the "Return to Call" button is clicked', () => {
        const handleReturnMock = jest.fn();
        render(<AfterCallView handleReturn={handleReturnMock} />);
        const buttonElement = screen.getByRole('button', { name: /return to call/i });
        userEvent.click(buttonElement);
        expect(handleReturnMock).toHaveBeenCalled();
    });
});