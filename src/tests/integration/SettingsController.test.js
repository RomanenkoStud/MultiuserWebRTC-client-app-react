import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SettingsController from '../../controllers/SettingsController';

const mockStore = configureMockStore();

describe('SettingsController', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
        settings: {
            config: {
            mic: false,
            cam: true,
            blur: true,
            },
        },
        });
    });

    it('should render SettingsView component', () => {
        render(
        <Provider store={store}>
            <SettingsController />
        </Provider>
        );
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Camera configuration')).toBeInTheDocument();
    });

    it('should dispatch changeConfig action when Switch is toggled', () => {
        render(
        <Provider store={store}>
            <SettingsController />
        </Provider>
        );

        userEvent.click(screen.getByTestId('mic-switch'));
        expect(store.getActions()).toEqual([{ type: 'settings/changeConfig', payload: { mic: true } }]);

        userEvent.click(screen.getByTestId('cam-switch'));
        expect(store.getActions()).toEqual([
        { type: 'settings/changeConfig', payload: { mic: true } },
        { type: 'settings/changeConfig', payload: { cam: false } },
        ]);

        userEvent.click(screen.getByTestId('blur-switch'));
        expect(store.getActions()).toEqual([
            { type: 'settings/changeConfig', payload: { mic: true } },
            { type: 'settings/changeConfig', payload: { cam: false } },
            { type: 'settings/changeConfig', payload: { blur: false } },
        ]);
    });
});