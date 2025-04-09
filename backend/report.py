from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os
import pandas as pd
from dotenv import load_dotenv
from db import engine  # SQLAlchemy engine

load_dotenv()

def fetch_data_for_zip(zipcode):
    query = f"""
    SELECT * FROM  stagged_data
    WHERE zip_code = '{zipcode}' 
    """
    df = pd.read_sql(query, engine)
    return df


class ReportGenerator:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama3-70b-8192"
        )

        self.prompt = PromptTemplate.from_template("""
        You are a healthcare risk analysis expert. Based on the following factors and model prediction:

        Zipcode: {zipcode}
        Detected ER Spike Factor: {erspike}
        

        SDoH Factors:
        Unemployment Rate: {unemployment}
        Eviction Rate: {eviction}
        Literacy Rate: {literacy}
        Population Density: {pop_density}
        School Absenteeism Rate: {absentee}
        Crime Rate: {crime}
        Weather Severity Index: {weather}

        Generate a detailed report that contains:
        1. Current Hospital Bed Requirement Estimation.
        2. ER Surge Prediction for the next 2-3 weeks.
        3. Accuracy Check and Confidence based on ER Spike Factor.
        4. Observations on how different SDoH factors might have contributed to the surge.
        5. Suggestions to Hospitals and Healthcare Administrators.

        Be professional, concise, and use data-backed phrases.
        """)

    