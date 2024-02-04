from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from keras.preprocessing import image
import numpy as np
from io import BytesIO
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = ResNet50(weights='imagenet')


@app.route('/upload', methods=['POST'])
def image_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Process the uploaded image directly
    img = image.load_img(BytesIO(file.read()), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = predict_image(img_array)
    time.sleep(3)
    return jsonify({'message': 'Image recognized successfully', 'predictions': predictions})


def predict_image(img_array):
    predictions = model.predict(img_array)
    decoded_predictions = decode_predictions(predictions)

    # Extracting top 3 predictions
    top_predictions = [
        {'label': str(label).capitalize(),
         'probability': float(round(prob*100,2))}
        for (_, label, prob) in decoded_predictions[0]
    ]

    return top_predictions


if __name__ == '__main__':
    app.run(debug=True)
