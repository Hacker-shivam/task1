from flask import Flask, request, jsonify
from flask_cors import CORS
from services.analytics import analyze

app = Flask(__name__)

CORS(app, origins=[
    "https://task1-eta-nine.vercel.app",
    "http://localhost:5173"
])

@app.route("/")
def home():
    return {"status": "Flask ML Server Running"}

@app.route("/analyze", methods=["POST"])
def analyze_route():
    data = request.json
    result = analyze(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)