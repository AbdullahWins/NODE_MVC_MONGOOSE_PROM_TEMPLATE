/**
 * AsyncHandler - Middleware to handle asynchronous operations with error catching.
 *
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - Middleware function that handles asynchronous operations.
 */
const asyncHandler = (fn) => (req, res, next) => {
  //Execute the asynchronous function and ensure it returns a promise
  Promise.resolve(fn(req, res, next))
    //If the promise resolves successfully, continue to the next middleware
    .catch(next); //If an error occurs, pass it to the next error-handling middleware
};

module.exports = { asyncHandler };
