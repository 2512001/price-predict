const validationMiddleware = (schema) => {
    return async (req, res, next) => {
      try {
        const { error } = schema.validate(req.body, { abortEarly: false });
        console.log(error);
        if (error) {
          const messages = error.details.map(detail => detail.message);
  
          return res.json({
            success: false,
            error : "from joi validation",
            message: messages[0], // Send first message or you can send all
          });
        }
  
        next();
      } catch (err) {
        console.error('Validation error:', err);
        return res.status(500).json({
          success: false,
          message: 'Something went wrong during validation',
        });
      }
    };
  };
  
  module.exports = validationMiddleware;
  