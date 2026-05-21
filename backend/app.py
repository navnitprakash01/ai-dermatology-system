import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model

from utils.prediction import allowed_file, predict_skin_disease, save_image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
MODEL_PATH = os.path.join(BASE_DIR, 'skin_model.h5')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB

CORS(app, resources={r"/predict": {"origins": "*"}})

# Global variable to store the loaded model
# Loaded once during Flask startup for optimal performance
model = None


def load_trained_model() -> None:
    """
    Load the trained MobileNetV2 model from disk.
    This is called once when the Flask app starts, not on every request.
    """
    global model
    if not os.path.exists(MODEL_PATH):
        app.logger.error(f'Model file not found at {MODEL_PATH}')
        app.logger.error('Please run: python train_model.py')
        model = None
        return

    try:
        model = load_model(MODEL_PATH)
        app.logger.info(f'Successfully loaded trained model from {MODEL_PATH}')
    except Exception as e:
        app.logger.error(f'Failed to load model: {str(e)}')
        model = None


@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle skin disease prediction requests from the frontend.
    
    Expected request format:
    - POST /predict
    - Content-Type: multipart/form-data
    - Form field: file (image file)
    
    Response format on success:
    {
        "disease": "Disease Name",
        "confidence": 85.5,
        "severity": "Moderate confidence"
    }
    
    Response format on error:
    {
        "error": "Error description"
    }
    """
    # Check if model is loaded
    if model is None:
        return jsonify({'error': 'Model not loaded. Please restart the server.'}), 503

    # Validate file presence
    if 'file' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename provided'}), 400

    # Validate file format
    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported image format'}), 415

    try:
        # Save uploaded image temporarily
        saved_path = save_image(file, app.config['UPLOAD_FOLDER'])
        
        # Run model inference on the image
        prediction = predict_skin_disease(model, saved_path)
        app.logger.info(
            f"Predicted disease={prediction.get('disease')} "
            f"confidence={prediction.get('confidence')} "
            f"severity={prediction.get('severity')}"
        )
        return jsonify(prediction), 200
    except ValueError as exc:
        # Handle preprocessing or prediction errors
        return jsonify({'error': str(exc)}), 400
    except Exception:
        # Log unexpected errors for debugging
        app.logger.exception('Prediction request failed')
        return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'Image too large. Limit is 10MB.'}), 413


# Load the model once during Flask startup.
# This ensures the model is ready before the first request arrives.
load_trained_model()
if __name__ == "__main__":
    import os

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )