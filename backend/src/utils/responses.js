exports.sendSuccess = (res, statusCode, message, data, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra
  })
}

exports.sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  })
}