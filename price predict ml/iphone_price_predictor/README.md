# iPhone Price Drop Predictor

A machine learning service that predicts whether the price of an iPhone will drop in the next 3 months and estimates the potential price drop percentage.

## Features

- Predicts if an iPhone's price will drop in the next 3 months with 70% confidence
- Estimates the percentage and amount of price drop if one is predicted
- Provides a simple REST API for integration with other applications
- Pre-trained models that can be easily updated with new data

## Project Structure

```
iphone_price_predictor/
├── data/
│   └── historical_data_inr.csv    # Sample historical iPhone price data
├── models/                        # Directory for saved models (created after training)
├── train_and_save_models.py       # Script to train and save models
├── prediction_service.py          # Flask web service for predictions
├── requirements.txt               # Python dependencies
└── README.md                     # This file
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iphone_price_predictor
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the models**
   ```bash
   python train_and_save_models.py
   ```
   This will create a `models/` directory containing the trained models.

5. **Start the prediction service**
   ```bash
   python prediction_service.py
   ```
   The service will start on `http://0.0.0.0:5000`

## API Usage

### Make a Prediction

Send a POST request to `/predict` with the following JSON payload:

```json
{
    "model_name": "iPhone 14",
    "storage_gb": 128,
    "months_since_launch": 3,
    "current_price_inr": 79900
}
```

### Example using cURL

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "iPhone 14",
    "storage_gb": 128,
    "months_since_launch": 3,
    "current_price_inr": 79900
  }'
```

### Example Response

```json
{
  "model_name": "iPhone 14",
  "storage_gb": 128,
  "current_price_inr": 79900,
  "will_drop": true,
  "drop_probability": 0.85,
  "percent_drop": 5.2,
  "price_drop_inr": 4154.8,
  "predicted_new_price_inr": 75745.2
}
```

### Health Check

```bash
curl http://localhost:5000/health
```

## Model Details

- **Classifier**: Random Forest to predict if price will drop (binary classification)
- **Regressor**: Random Forest to predict percentage drop (regression)
- **Features**:
  - Storage capacity (GB)
  - Months since launch
  - iPhone model (one-hot encoded)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
