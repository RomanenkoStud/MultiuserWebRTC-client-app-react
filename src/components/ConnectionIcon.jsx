import { useConnectionQuality } from '../hooks/useConnectionQuality';
import SignalCellular0BarIcon from '@mui/icons-material/SignalCellular0Bar';
import SignalCellular1BarIcon from '@mui/icons-material/SignalCellular1Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellular3BarIcon from '@mui/icons-material/SignalCellular3Bar';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';

const ConnectionIcon = ({ peerConnection, color }) => {
    const rating = useConnectionQuality(peerConnection);

    switch (rating) {
        case 1:
            return <SignalCellular0BarIcon color={color} />;
        case 2:
            return <SignalCellular1BarIcon color={color} />;
        case 3:
            return <SignalCellular2BarIcon color={color} />;
        case 4:
            return <SignalCellular3BarIcon color={color} />;
        case 5:
            return <SignalCellular4BarIcon color={color} />;
        default:
            return <SignalCellular0BarIcon color={color} />;
    }
};

export default ConnectionIcon;