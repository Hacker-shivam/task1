import sys
import json
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

def analyze(data):
    df = pd.DataFrame(data)

    if len(df) == 0:
        return {"message": "No data"}

    insights = {}

    # 🔹 Basic Metrics
    insights["total_leads"] = len(df)

    converted_df = df[df["status"] == "Converted"]
    insights["conversion_rate"] = round((len(converted_df) / len(df)) * 100, 2)

    insights["top_city"] = df["city"].mode()[0] if "city" in df else None
    insights["top_service"] = df["service"].mode()[0] if "service" in df else None

    insights["status_distribution"] = df["status"].value_counts().to_dict()

    # 🔹 Conversion by City
    city_conversion = df.groupby("city")["status"].apply(
        lambda x: (x == "Converted").mean()
    ).sort_values(ascending=False)

    insights["best_city_for_conversion"] = city_conversion.idxmax()

    # 🔹 Conversion by Service
    service_conversion = df.groupby("service")["status"].apply(
        lambda x: (x == "Converted").mean()
    ).sort_values(ascending=False)

    insights["best_service_for_conversion"] = service_conversion.idxmax()

    # 🔹 ML Prediction (Logistic Regression)
    try:
        df_ml = df.copy()

        df_ml["converted"] = df_ml["status"].apply(lambda x: 1 if x == "Converted" else 0)

        le_city = LabelEncoder()
        le_service = LabelEncoder()

        df_ml["city"] = le_city.fit_transform(df_ml["city"].astype(str))
        df_ml["service"] = le_service.fit_transform(df_ml["service"].astype(str))

        X = df_ml[["city", "service", "budget"]].fillna(0)
        y = df_ml["converted"]

        model = LogisticRegression()
        model.fit(X, y)

        # Predict probability for latest lead
        last_lead = X.iloc[-1].values.reshape(1, -1)
        prob = model.predict_proba(last_lead)[0][1]

        insights["latest_lead_conversion_probability"] = round(prob * 100, 2)

    except Exception as e:
        insights["ml_error"] = str(e)

    # 🔹 Smart Recommendations
    recommendations = []

    if insights["conversion_rate"] < 30:
        recommendations.append("Improve follow-up strategy to increase conversions")

    if "Interested" in insights["status_distribution"]:
        recommendations.append("Focus on converting 'Interested' leads")

    recommendations.append(
        f"Focus marketing in {insights['best_city_for_conversion']}"
    )
    recommendations.append(
        f"Promote {insights['best_service_for_conversion']} service more"
    )

    insights["recommendations"] = recommendations

    return insights


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = analyze(input_data)
    print(json.dumps(result))