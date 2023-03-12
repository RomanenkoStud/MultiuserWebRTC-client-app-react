import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoAnimationContext } from '../components/LogoAnimationContext';

export function useLogoAnimation() {
    const navigate = useNavigate();
    const { logoAnimationState, setLogoAnimationState } = useContext(LogoAnimationContext);

    function startAnimation() {
        setLogoAnimationState(true);
    }

    function navigateWithAnimation(to) {
        startAnimation();
        navigate(to);
    }

    return {
        logoAnimationState,
        navigate: navigateWithAnimation,
    };
}