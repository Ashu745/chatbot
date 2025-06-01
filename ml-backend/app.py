from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_processor import extract_product_name
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "NLP backend is running."})

@app.route("/api/nlp", methods=["POST"])
def process_text():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    user_text = data['text']
    product_name = extract_product_name(user_text)

    if not product_name:
        return jsonify({"product": None, "message": "No product found in input"}), 200

    # Step 3: Forward extracted product to Node backend for product comparison
    try:
        node_response = requests.post(
            "http://localhost:5000/api/products/compare",
            json={"query": product_name}
        )
        result = node_response.json()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "product": product_name,
            "error": str(e),
            "message": "Failed to fetch comparison data from Node backend"
        }), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
