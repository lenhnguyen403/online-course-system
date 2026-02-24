export const auditMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userId = req.user ? req.user.id : 'Anonymous';
    console.log(`[${timestamp}] ${method} ${url} - User: ${userId}`);
    next();
}