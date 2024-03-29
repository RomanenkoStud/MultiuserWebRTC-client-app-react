import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer({ value, iconSize, ...other }) {
    const { icon } = customIcons[value];
    return (
        <span
            style={{ fontSize: iconSize }}
            {...other}
        >
            {React.cloneElement(icon, { fontSize: 'inherit' })}
        </span>
        );
}

IconContainer.propTypes = {
value: PropTypes.number.isRequired,
iconSize: PropTypes.string.isRequired,
};

export default function RadioGroupRating({ defaultRating, rating, handleRating, iconSize }) {
return (
    <StyledRating
    data-testid="rating"
    name="highlight-selected-only"
    defaultValue={defaultRating}
    IconContainerComponent={(props) => <IconContainer {...props} iconSize={iconSize} />}
    getLabelText={(value) => customIcons[value].label}
    highlightSelectedOnly
    value={rating}
    onChange={(event, newValue) => {
        handleRating(newValue);
    }}
    />
);
}