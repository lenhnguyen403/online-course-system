export const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    req.pagination = {
        page,
        size,
        offset: page * size,
        limit: size
    }

    next();
}