import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime

def load_and_preprocess_data(filepath):
    # Load the data
    df = pd.read_csv(filepath)
    
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by model and date
    df = df.sort_values(['model_name', 'storage_gb', 'date'])
    
    # Create features
    df['months_since_launch'] = df.groupby('model_name')['date'].rank(method='dense')
    
    # Create target variables
    df['next_3m_price'] = df.groupby(['model_name', 'storage_gb'])['price_inr'].shift(-3)
    df['price_drop'] = df['price_inr'] - df['next_3m_price']
    df['will_drop_in_3_months'] = (df['price_drop'] > 0).astype(int)
    df['percent_drop_in_3_months'] = (df['price_drop'] / df['price_inr']) * 100
    
    # Drop rows with NaN in target variables
    df = df.dropna(subset=['will_drop_in_3_months', 'percent_drop_in_3_months'])
    
    # One-hot encode model names
    df = pd.get_dummies(df, columns=['model_name'])
    
    return df

def train_models(df):
    # Features for training
    feature_columns = ['storage_gb', 'months_since_launch'] + \
                     [col for col in df.columns if col.startswith('model_name_')]
    
    X = df[feature_columns]
    y_class = df['will_drop_in_3_months']
    y_reg = df['percent_drop_in_3_months']
    
    # Split data (use same random state for reproducibility)
    X_train, X_test, y_class_train, y_class_test, y_reg_train, y_reg_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42
    )
    
    # Train classifier
    print("Training classifier...")
    classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    classifier.fit(X_train, y_class_train)
    
    # Train regressor only on samples where price dropped
    print("Training regressor...")
    regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    regressor.fit(X_train[y_class_train == 1], y_reg_train[y_class_train == 1])
    
    return classifier, regressor, feature_columns

def save_models(classifier, regressor, feature_columns, output_dir='models'):
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Save models and feature columns
    joblib.dump(classifier, f'{output_dir}/classifier_model.joblib')
    joblib.dump(regressor, f'{output_dir}/regressor_model.joblib')
    joblib.dump(feature_columns, f'{output_dir}/model_features.joblib')
    
    print(f"Models saved to {output_dir}/")

def main():
    # File paths
    data_file = 'data/historical_data_inr.csv'
    models_dir = 'models'
    
    print("Loading and preprocessing data...")
    df = load_and_preprocess_data(data_file)
    
    print("Training models...")
    classifier, regressor, feature_columns = train_models(df)
    
    print("Saving models...")
    save_models(classifier, regressor, feature_columns, models_dir)
    
    print("Training and model saving completed successfully!")

if __name__ == "__main__":
    main()
