from flask import Flask, request, jsonify
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)

# Global variables to store the models and feature columns
classifier = None
regressor = None
feature_columns = None

# Threshold for price drop prediction
PRICE_DROP_THRESHOLD = 0.7


def load_models(models_dir='models'):
    """Load the pre-trained models and feature columns."""
    global classifier, regressor, feature_columns

    try:
        classifier = joblib.load(f'{models_dir}/classifier_model.joblib')
        regressor = joblib.load(f'{models_dir}/regressor_model.joblib')
        feature_columns = joblib.load(f'{models_dir}/model_features.joblib')
        print("Models loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        return False


@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict if the price of an iPhone will drop in the next 3 months.

    Expected JSON payload:
    {
        "model_name": "iPhone 14",   # Must match the exact model name from training
        "storage_gb": 128,           # Storage in GB (e.g., 64, 128, 256, etc.)
        "months_since_launch": 3,    # Number of months since launch
        "current_price_inr": 79900   # Current price in INR
    }
    """
    # Check if models are loaded
    if classifier is None or regressor is None or feature_columns is None:
        return jsonify({
            'error': 'Models not loaded. Please ensure the server is properly initialized.'
        }), 500

    # Get JSON data from request
    data = request.get_json(silent=True) or {}

    # Validate required fields
    required_fields = ['model_name', 'storage_gb', 'months_since_launch', 'current_price_inr']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields. Please provide model_name, storage_gb, months_since_launch, and current_price_inr.'
        }), 400

    try:
        # Parse numeric fields safely
        storage_gb = int(data['storage_gb'])
        months_since_launch = int(data['months_since_launch'])
        current_price_inr = float(data['current_price_inr'])

        # Prepare input data for prediction
        input_data = {
            'storage_gb': [storage_gb],
            'months_since_launch': [months_since_launch]
        }

        # Add model name one-hot encoded columns
        model_name_col = f"model_name_{str(data['model_name']).lower().replace(' ', '_')}"
        for col in feature_columns:
            if col.startswith('model_name_'):
                input_data[col] = [1 if col == model_name_col else 0]

        # Ensure all feature columns exist in the DataFrame (fill missing with 0)
        for col in feature_columns:
            if col not in input_data:
                # For any extra features that might exist in the model
                input_data[col] = [0]

        # Create DataFrame with all feature columns in correct order
        X = pd.DataFrame(input_data, columns=feature_columns)

        # ---------- FIXED PART: SAFE PROBABILITY COMPUTATION ----------
        proba_all = classifier.predict_proba(X)[0]        # 1D array of probabilities
        classes = classifier.classes_                     # e.g. [0, 1] or [1] or [0]

        if 1 in classes:
            idx_1 = list(classes).index(1)
            drop_probability = float(proba_all[idx_1])
        else:
            # No class "1" in training; treat as "no drop" model
            drop_probability = 0.0
        # -------------------------------------------------------------

        will_drop = drop_probability >= PRICE_DROP_THRESHOLD

        # Base response
        response = {
            'model_name': data['model_name'],
            'storage_gb': storage_gb,
            'current_price_inr': current_price_inr,
            'will_drop': bool(will_drop),
            'drop_probability': float(drop_probability)
        }

        # If price is predicted to drop, calculate the expected new price
        if will_drop:
            percent_drop = float(regressor.predict(X)[0])
            price_drop = (percent_drop / 100.0) * current_price_inr
            new_price = current_price_inr - price_drop

            response.update({
                'percent_drop': float(percent_drop),
                'price_drop_inr': float(price_drop),
                'predicted_new_price_inr': float(new_price)
            })

        return jsonify(response)

    except Exception as e:
        return jsonify({
            'error': f'An error occurred during prediction: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the service is running."""
    return jsonify({
        'status': 'ok',
        'models_loaded': all([
            classifier is not None,
            regressor is not None,
            feature_columns is not None
        ])
    })


if __name__ == '__main__':
    # Load models when starting the server
    if load_models():
        print("Starting Flask server...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("Failed to load models. Exiting...")
