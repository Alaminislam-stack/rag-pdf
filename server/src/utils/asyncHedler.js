export const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((err) => next(err)); // Catch any errors and pass them to the next middleware
  };
};