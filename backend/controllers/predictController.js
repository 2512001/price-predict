const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Flask ML model URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000/predict";
const MODEL_VERSION = process.env.MODEL_VERSION || "v1.0";
const MODEL_TIMEOUT_MS = parseInt(process.env.MODEL_TIMEOUT_MS || "3000", 10);

// ------------ Validate Input ------------
const validateInput = (body) => {
  const errors = [];

  if (!body.product_id) errors.push("product_id is required");
  if (!body.user_id) errors.push("user_id is required");

  if (!body.features) {
    errors.push("features is required");
  } else {
    const { model_name, storage_gb, months_since_launch, current_price_inr } = body.features;
    if (!model_name) errors.push("features.model_name is required");
    if (storage_gb === undefined) errors.push("features.storage_gb is required");
    if (months_since_launch === undefined) errors.push("features.months_since_launch is required");
    if (current_price_inr === undefined) errors.push("features.current_price_inr is required");
  }

  return errors;
};

// ------------ Controller ------------

exports.predictPrice  =  async (req, res) => {
  const request_id = uuidv4();
  const startTime = Date.now();

  // Validate input
  const errors = validateInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors,
      request_id
    });
  }

  const { features, product_id, user_id } = req.body;

  try {
    // 🔥 Call ML model service (Flask)
    const mlRes = await axios.post(
      ML_SERVICE_URL,
      {
        model_name: features.model_name,
        storage_gb: features.storage_gb,
        months_since_launch: features.months_since_launch,
        current_price_inr: features.current_price_inr
      },
      { timeout: MODEL_TIMEOUT_MS }
    );

    const latency_ms = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      request_id,
      product_id,
      user_id,
      model_version: MODEL_VERSION,
      latency_ms,
      ...mlRes.data   // include ML model prediction result in response
    });

  } catch (error) {
    const latency_ms = Date.now() - startTime;

    // Model Timeout
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        request_id,
        message: "ML service timeout",
        latency_ms
      });
    }

    return res.status(502).json({
      success: false,
      request_id,
      message: "Failed to get prediction from ML model",
      error: error.message,
      latency_ms
    });
  }
};