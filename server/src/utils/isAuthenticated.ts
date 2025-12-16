export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Unauthorized"); // User is not authenticated
    }
};
