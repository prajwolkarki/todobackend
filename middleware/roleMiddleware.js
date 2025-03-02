// rbacMiddleware.js
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Error in RBAC middleware:', error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}

module.exports = checkRole;