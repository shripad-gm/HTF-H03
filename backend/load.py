import pandas as pd
from sqlalchemy.orm import Session
from db_schema import HTF  # Your model
from db import engine  # Your database engine

# Read CSV
df = pd.read_csv("load.csv")

# Open DB Session
session = Session(bind=engine)

# Iterate and insert row by row
for _, row in df.iterrows():
    data = HTF(
        zip_code=row['zip_code'],
        month=row['month'],
        UnemploymentRate=row['UnemploymentRate'],
        EvictionRate=row['EvictionRate'],
        LiteracyRate=row['LiteracyRate'],
        PopulationDensity=row['PopulationDensity'],
        SchoolAbsenteeismRate=row['SchoolAbsenteeismRate'],
        CrimeRate=row['CrimeRate'],
        WeatherSeverityIndex=row['WeatherSeverityIndex'],
        ERSpikeFactor=row['ERSpikeFactor']
    )
    session.add(data)

# Commit data to DB
session.commit()
session.close()

print("Data Insertion Completed!")
