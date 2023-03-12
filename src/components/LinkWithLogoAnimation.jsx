import { Link } from 'react-router-dom';
import { useLogoAnimation } from '../hooks/useLogoAnimation';

function LinkWithLogoAnimation(props) {
    const { navigate } = useLogoAnimation();

    function handleClick(event) {
        event.preventDefault();
        navigate(props.to);
    }

    return <Link {...props} onClick={handleClick} />;
}

export default LinkWithLogoAnimation;