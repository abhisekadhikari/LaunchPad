const asyncErrorHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res)
    } catch (error) {
        next(error)
    }
}

export default asyncErrorHandler
