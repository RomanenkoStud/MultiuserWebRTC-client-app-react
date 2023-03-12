import { createContext, useState } from 'react';

export const LogoAnimationContext = createContext();

export function LogoAnimationProvider({ children }) {
    const [logoAnimationState, setLogoAnimationState] = useState(false);

    return (
        <LogoAnimationContext.Provider value={{ logoAnimationState, setLogoAnimationState }}>
        {children}
        </LogoAnimationContext.Provider>
    );
}