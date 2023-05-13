import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import SettingsView from '../../views/SettingsView';

const mockSettings = {
    config: {
        cam: false,
        mic: true,
        blur: true,
    }
};

const mockHandleConfig = jest.fn();

describe('SettingsView', () => {
    it('renders the correct labels and switches are checked based on the settings prop', () => {
        render(<SettingsView settings={mockSettings} handleConfig={mockHandleConfig} />);

        expect(screen.getByRole('checkbox', { name: /mic/i })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: /cam/i })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: /blur/i })).toBeChecked();
    });

    it('calls the handleConfig function when a switch is toggled', () => {
        render(<SettingsView settings={mockSettings} handleConfig={mockHandleConfig} />);
        
        userEvent.click(screen.getByTestId("cam-switch"));
        expect(mockHandleConfig).toHaveBeenCalledWith('cam', true);

        userEvent.click(screen.getByTestId("blur-switch"));
        expect(mockHandleConfig).toHaveBeenCalledWith('blur', false);
    });
});