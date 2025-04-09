const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export {asyncHandler}

//----------------------------------------------------------OR---------------------------------------------------------------------------------------------------------

// const asyncHandler = (fn) => (req, res, next) => {
//   return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
// };

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------