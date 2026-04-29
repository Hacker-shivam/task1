import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

def analyze(data):
    df = pd.DataFrame(data)

    if df.empty:
        return {"message": "No data"}

    insights = {}

    insights["total_leads"] = len(df)

    converted = df[df["status"] == "Converted"]
    insights["conversion_rate"] = round(len(converted) / len(df) * 100, 2)

    insights["top_city"] = df["city"].mode()[0]
    insights["top_service"] = df["service"].mode()[0]

    insights["status_distribution"] = df["status"].value_counts().to_dict()

    city_conversion = df.groupby("city")["status"].apply(lambda x: (x == "Converted").mean())
    service_conversion = df.groupby("service")["status"].apply(lambda x: (x == "Converted").mean())

    insights["best_city"] = city_conversion.idxmax()
    insights["best_service"] = service_conversion.idxmax()

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

        last = X.iloc[-1].values.reshape(1, -1)
        prob = model.predict_proba(last)[0][1]

        insights["prediction"] = round(prob * 100, 2)

    except Exception as e:
        insights["ml_error"] = str(e)

    return insights