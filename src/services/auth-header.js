export default function authHeader(token) {
    if (token) {
        return { Authorization: `${token}` };
    } else {
        return {};
    }
}