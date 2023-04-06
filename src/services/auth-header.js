export default function authHeader(user) {
    if (user && user.token) {
        return { Authorization: user.token };
    } else {
        return {};
    }
}