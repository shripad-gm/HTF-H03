from flask import Flask, jsonify, request
from sqlalchemy.orm import Session
from db_schema import HTF
from db import engine
from report import ReportGenerator, fetch_data_for_zip
app = Flask(__name__)

@app.route("/get_data", methods=["GET"])
def get_data():
    # Get zip_code from query parameters
    zip_code = request.args.get("zip_code")

    if not zip_code:
        return jsonify({"error": "zip_code parameter is required"}), 400

    # Create a session
    session = Session(bind=engine)

    # Query data for the specific zip_code
    data = session.query(HTF).filter(HTF.zip_code == zip_code).all()

    # Check if data exists for the given zip_code
    if not data:
        return jsonify({"error": f"No data found for zip_code {zip_code}"}), 404

    # Convert the data to a list of dictionaries
    data_list = []
    for row in data:
        data_dict = {
            "id": row.id,
            "zip_code": row.zip_code,
            "month": row.month,
            "UnemploymentRate": row.UnemploymentRate,
            "EvictionRate": row.EvictionRate,
            "LiteracyRate": row.LiteracyRate,
            "PopulationDensity": row.PopulationDensity,
            "SchoolAbsenteeismRate": row.SchoolAbsenteeismRate,
            "CrimeRate": row.CrimeRate,
            "WeatherSeverityIndex": row.WeatherSeverityIndex,
            "ERSpikeFactor": row.ERSpikeFactor
        }
        data_list.append(data_dict)

    # Close the session
    session.close()

    # Return the data as JSON
    return jsonify(data_list)

@app.route("/generate_report", methods=["GET"])
def generate_report():
    zip_code = request.args.get("zip_code")
    if not zip_code:
        return jsonify({"error": "zip_code parameter is required"}), 400

    # Fetch data
    df = fetch_data_for_zip(zip_code)
    if df.empty:
        return jsonify({"error": f"No data found for zip_code {zip_code}"}), 404

    # Initialize report generator
    report_gen = ReportGenerator()

    try:
        rendered_prompt = report_gen.prompt.format(
            zipcode=zip_code,
            erspike=df['ERSpikeFactor'][0],
            unemployment=df['UnemploymentRate'][0],
            eviction=df['EvictionRate'][0],
            literacy=df['LiteracyRate'][0],
            pop_density=df['PopulationDensity'][0],
            absentee=df['SchoolAbsenteeismRate'][0],
            crime=df['CrimeRate'][0],
            weather=df['WeatherSeverityIndex'][0],
        )

        response = report_gen.llm.invoke(rendered_prompt)
        return jsonify({"report": response.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
