
import pandas as pd # type: ignore
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore

# Create your dataset
data = pd.DataFrame({
    'source': ['Mumbai', 'Mumbai', 'Delhi', 'Delhi', 'Delhi'],
    'destination': ['Delhi', 'Chennai', 'Shimla', 'Mumbai', 'Shimla'],
    'mode_of_transportation': ['Air', 'Road', 'Air', 'Air', 'Road'],
    'weight': [10, 20, 10, 10, 30],
    'cost': [10000, 5000, 15000, 9000, 12000],
    'time': ['1-2 days', '3-4 days', '2-3 days', '1-2 days', '5-6 days']
})

# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get request data
        data_request = request.json
        print(data_request)
        source = data_request.get('source')
        destination = data_request.get('destination')
        mode_of_transportation = data_request.get('mode_of_transportation')
        weight = float(data_request.get('weight', 0))

        if not source or not destination or not mode_of_transportation or weight <= 0:
            return jsonify({'error': 'Invalid input. Please provide source, destination, mode_of_transportation, and weight.'}), 400

        # Filter for exact matches
        direct_routes = data[(data['source'] == source) &
                              (data['destination'] == destination) &
                              (data['mode_of_transportation'] == mode_of_transportation) &
                              (data['weight'] >= weight)]

        # If a direct route is available, choose the best one
        if not direct_routes.empty:
            best_route = direct_routes.iloc[0]
            response = {
                'best_route': f"{best_route['source']} -> {best_route['destination']}",
                'cost': int(best_route['cost']),
                'time': best_route['time']
            }
        else:
            # Check for multi-hop routes
            possible_routes = data[(data['source'] == source) &
                                    (data['mode_of_transportation'] == mode_of_transportation) &
                                    (data['weight'] >= weight)]

            final_routes = []

            for _, route in possible_routes.iterrows():
                next_leg = data[(data['source'] == route['destination']) &
                                (data['destination'] == destination) &
                                (data['mode_of_transportation'] == mode_of_transportation) &
                                (data['weight'] >= weight)]

                if not next_leg.empty:
                    total_cost = route['cost'] + next_leg.iloc[0]['cost']
                    total_time = f"{route['time']} + {next_leg.iloc[0]['time']}"
                    final_routes.append({
                        'route': f"{route['source']} -> {route['destination']} -> {next_leg.iloc[0]['destination']}",
                        'cost': int(total_cost),
                        'time': total_time
                    })

            if final_routes:
                best_multi_hop = min(final_routes, key=lambda x: x['cost'])
                response = {
                    'best_route': best_multi_hop['route'],
                    'cost': best_multi_hop['cost'],
                    'time': best_multi_hop['time']
                }
            else:
                response = {
                    'message': 'No matching route found for the given input.'
                }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)

