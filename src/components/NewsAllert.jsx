import { Card, CardContent, Typography, Link } from '@mui/material';

const NewsAllert = ({ title, link }) => {
    return (
        <Card>
        <CardContent>
            <Typography variant="h5">{title}</Typography>
            <Link href={link} target="_blank" rel="noopener noreferrer">Read More</Link>
        </CardContent>
        </Card>
    );
};

export default NewsAllert;