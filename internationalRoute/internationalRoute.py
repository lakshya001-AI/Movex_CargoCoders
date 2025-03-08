from flask import Flask, request, jsonify # type: ignore
import math
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

# Function to calculate distance (dummy implementation for now)
def calculate_distance(city1, city2):
    # distances = {
    #     ("mumbai", "chennai"): 1338,
    #     ("chennai", "singapore"): 2920,
    #     ("dhanbad", "delhi"): 1200,
    #     ("delhi", "dubai"): 2200,
    #     ("mumbai", "dubai"): 1920
    # }
    distances = {
    ("mumbai", "chennai"): 1251,
    ("chennai", "singapore"): 2920,
    ("dhanbad", "delhi"): 1200,
    ("delhi", "dubai"): 2200,
    ("mumbai", "dubai"): 1920,
    ("dhanbad", "chennai"): 1500,  # Example distance
    ("chennai", "dubai"): 3400    # Example distance
}
    return distances.get((city1, city2), math.inf)

# Encode features for decision making
def encode_features(data):
    transport_modes = {"road": 1, "air": 2, "sea": 3}
    item_types = {"perishable": 1, "non-perishable": 2}

    return {
        "origin_country": data["origin_country"].lower(),
        "destination_country": data["destination_country"].lower(),
        "origin_city": data["origin_city"].lower(),
        "destination_city": data["destination_city"].lower(),
        "mode_within_country": transport_modes[data["mode_within_country"].lower()],
        "mode_between_countries": transport_modes[data["mode_between_countries"].lower()],
        "item_type": item_types[data["item_type"].lower()]
    }

@app.route('/route', methods=['POST'])
def get_route():
    try:
        data = request.json
        features = encode_features(data)

        # Decision rules for routes
        if features["origin_country"] == "india" and features["destination_country"] == "singapore":
            if features["origin_city"] == "mumbai" and features["destination_city"] == "singapore":
                if features["mode_within_country"] == 1 and features["mode_between_countries"] == 3:
                    route = "mumbai to chennai by road, chennai to singapore by sea"
                elif features["mode_within_country"] == 2 and features["mode_between_countries"] == 2:
                    route = "mumbai to chennai by air, chennai to singapore by air"
                else:
                    route = "Route not available"
            else:
                route = "Route not available"

        elif features["origin_country"] == "india" and features["destination_country"] == "uae":
            if features["origin_city"] == "dhanbad" and features["destination_city"] == "dubai":
                if features["mode_within_country"] == 1 and features["mode_between_countries"] == 2:
                    route = "dhanbad to delhi by road, delhi to dubai by air"
                else:
                    route = "Route not available"
            elif features["origin_city"] == "mumbai" and features["destination_city"] == "dubai":
                if features["mode_within_country"] == 2 and features["mode_between_countries"] == 3:
                    route = "mumbai to dubai by sea directly"
                else:
                    route = "Route not available"
            else:
                route = "Route not available"
        else:
            route = "Route not available"

        # Add distance calculation (dummy implementation)
        distance_within = calculate_distance(features["origin_city"], "chennai")
        distance_between = calculate_distance("chennai", features["destination_city"])

        return jsonify({
            "route": route,
            "distance_within_country": distance_within if distance_within != math.inf else "Unknown",
            "distance_between_countries": distance_between if distance_between != math.inf else "Unknown"
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=3001)
