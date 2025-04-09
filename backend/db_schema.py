from sqlalchemy import Column, Integer, Float,String
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
Base=declarative_base()

class HTF(Base):
    __tablename__="stagged_data"
    id=Column(Integer,primary_key=True,index=True)
    zip_code=Column(Integer)
    month=Column(String)
    UnemploymentRate=Column(Float)
    EvictionRate=Column(Float)
    LiteracyRate=Column(Float)
    PopulationDensity=Column(Float)
    SchoolAbsenteeismRate=Column(Float)
    CrimeRate=Column(Float)
    WeatherSeverityIndex=Column(Float)
    ERSpikeFactor=Column(Float)
    

from db import engine
from db_schema import Base

Base.metadata.create_all(bind=engine)

