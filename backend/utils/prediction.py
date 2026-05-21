import os
import uuid
from typing import Any, Dict, Optional

import numpy as np
from PIL import Image
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Mapping from model output indices to disease labels and descriptions.
# Order must match the class folder order used during MobileNetV2 training.
DISEASE_LABELS = {
    0: {'code': 'akiec', 'name': 'Actinic Keratoses'},
    1: {'code': 'bcc', 'name': 'Basal Cell Carcinoma'},
    2: {'code': 'bkl', 'name': 'Benign Keratosis-like Lesions'},
    3: {'code': 'df', 'name': 'Dermatofibroma'},
    4: {'code': 'mel', 'name': 'Melanoma'},
    5: {'code': 'nv', 'name': 'Melanocytic Nevi'},
    6: {'code': 'vasc', 'name': 'Vascular Lesions'},
}


def estimate_severity(confidence: float) -> str:
    """Estimate severity level from the classifier confidence."""
    if confidence >= 0.90:
        return 'High confidence'
    if confidence >= 0.70:
        return 'Moderate confidence'
    if confidence >= 0.50:
        return 'Low confidence'
    return 'Uncertain prediction'


def allowed_file(filename: str) -> bool:
    """Check if the uploaded file has an allowed image extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def make_upload_path(filename: str, upload_folder: str) -> str:
    """Generate a secure, unique file path for the uploaded image."""
    extension = filename.rsplit('.', 1)[1].lower()
    safe_filename = secure_filename(f"{uuid.uuid4().hex}.{extension}")
    return os.path.join(upload_folder, safe_filename)


def save_image(file: FileStorage, upload_folder: str) -> str:
    """Save the uploaded image file to disk and return its path."""
    if not allowed_file(file.filename or ''):
        raise ValueError('Unsupported image format')

    os.makedirs(upload_folder, exist_ok=True)
    upload_path = make_upload_path(file.filename or 'upload.png', upload_folder)
    file.save(upload_path)
    return upload_path


def preprocess_image(image_path: str, target_size: tuple = (224, 224)) -> Optional[np.ndarray]:
    """
    Load and preprocess an image for MobileNetV2 model inference.
    
    Steps:
    1. Load image from disk
    2. Convert to RGB (ensures consistency for JPEG/PNG)
    3. Resize to target size (224x224 for MobileNetV2)
    4. Normalize pixel values to 0-1 range
    5. Expand dimensions for batch processing (add batch axis)
    
    Args:
        image_path: Full file path to the image
        target_size: Target dimensions as (height, width)
    
    Returns:
        Preprocessed image array ready for model.predict() or None if loading fails
    
    Raises:
        ValueError: If image cannot be loaded or processed
    """
    try:
        # Open image and convert to RGB (handles RGBA, grayscale, etc.)
        img = Image.open(image_path).convert('RGB')
        
        # Resize to MobileNetV2 input size
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        # Convert PIL Image to NumPy array
        img_array = np.array(img, dtype=np.float32)
        
        # Normalize pixel values from [0, 255] to [0, 1]
        img_array = img_array / 255.0
        
        # Add batch dimension: (height, width, channels) -> (1, height, width, channels)
        img_batch = np.expand_dims(img_array, axis=0)
        
        return img_batch
    except Exception as e:
        raise ValueError(f'Failed to preprocess image: {str(e)}')


def predict_skin_disease(model: Any, image_path: str) -> Dict[str, Any]:
    """
    Run MobileNetV2 model inference on a preprocessed skin lesion image.
    
    Args:
        model: Loaded TensorFlow/Keras MobileNetV2 model
        image_path: Full file path to the uploaded image
    
    Returns:
        Dictionary with 'disease', 'confidence', and 'severity' keys for frontend display
    
    Raises:
        ValueError: If preprocessing or model inference fails
    """
    try:
        # Preprocess the image for model input
        img_batch = preprocess_image(image_path)
        if img_batch is None:
            raise ValueError('Image preprocessing returned None')
        
        # Run model prediction
        predictions = model.predict(img_batch, verbose=0)
        
        # Extract the predicted class (highest probability)
        predicted_index = int(np.argmax(predictions[0]))
        confidence_value = float(predictions[0][predicted_index])
        
        # Get disease label from mapping
        if predicted_index not in DISEASE_LABELS:
            raise ValueError(f'Unexpected prediction index: {predicted_index}')
        
        disease_info = DISEASE_LABELS[predicted_index]
        
        print(
            f"Predicted class index={predicted_index} "
            f"code={disease_info['code']} "
            f"name={disease_info['name']} "
            f"confidence={confidence_value:.4f}"
        )
        
        confidence_percentage = round(confidence_value * 100, 2)
        severity = estimate_severity(confidence_value)
        
        # Format response for frontend
        return {
            'disease': disease_info['name'],
            'confidence': confidence_percentage,
            'severity': severity,
        }
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f'Model prediction failed: {str(e)}')
