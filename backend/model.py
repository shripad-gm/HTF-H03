import pandas as pd
import numpy as np
import sqlalchemy
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error
import joblib  # For saving the model
from db import engine, SessionLocal
from db_schema import HTF
# DB Connection (Assuming Staged DB is PostgreSQL)
#engine = sqlalchemy.create_engine('postgresql://username:password@host:port/database')

# Function to fetch data from staged DB
loaded_model = joblib.load('xgboost_model.pkl', 'rb')
def fetch_data():
    query = "SELECT * FROM stagged_data "
    df = pd.read_sql(query,engine)
    return df
# Preprocessing Function
def preprocess(df):
    scaler = MinMaxScaler()

    # Specify the features you will use for prediction
    features = ['UnemploymentRate', 'EvictionRate', 'LiteracyRate', 'PopulationDensity', 
                'SchoolAbsenteeismRate', 'CrimeRate', 'WeatherSeverityIndex']
    
    # Scale the features to range between 0 and 1
    df[features] = scaler.fit_transform(df[features])
    
    return df, scaler

# Train XGBoost Model
# def train_model(df):
#     features = ['UnemploymentRate', 'EvictionRate', 'LiteracyRate', 'PopulationDensity', 
#                 'SchoolAbsenteeismRate', 'CrimeRate', 'WeatherSeverityIndex']
#     target = 'ERSpikeFactor'  # This is the variable we want to predict

#     # Splitting data into features and target
#     X = df[features]
#     y = df[target]

#     # Split the data into training and testing sets
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # Initialize the XGBoost model
#     model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)

#     # Train the model
#     model.fit(X_train, y_train)

#     # Evaluate the model
#     preds = model.predict(X_test)
#     mse = mean_squared_error(y_test, preds)
#     print(f'Mean Squared Error on Test Set: {mse}')

#     # Feature importance (optional)
#     print("\nFeature Importances:")
#     feature_importances = model.feature_importances_
#     for feature, importance in zip(features, feature_importances):
#         print(f"{feature}: {importance}")

#     # Save the trained model to disk
#     joblib.dump(model, 'xgboost_model.pkl')
#     print("Model saved to 'xgboost_model.pkl'")

#     return model
features = ['UnemploymentRate', 'EvictionRate', 'LiteracyRate', 'PopulationDensity', 
            'SchoolAbsenteeismRate', 'CrimeRate', 'WeatherSeverityIndex']
# Main execution
print("Fetching data from staged DB...")
df = fetch_data()

print("Preprocessing data...")
df, scaler = preprocess(df)

X_new=df[features]
df["ERSpikeFactor"]=loaded_model.predict(X_new)

print("Updating Predictions in DB...")
session = SessionLocal()

try:
    for index, row in df.iterrows():
        db_row = session.query(HTF).filter(HTF.id == row['id']).first()
        if db_row:
            db_row.ERSpikeFactor = row['ERSpikeFactor']
    session.commit()
    print("DB Updated Successfully!")

except Exception as e:
    session.rollback()
    print("Error:", e)

finally:
    session.close()
