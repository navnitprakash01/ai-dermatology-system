"""Train a MobileNetV2-based skin disease classifier using HAM10000 data.

This script is designed to be backend-safe and beginner-friendly. It builds a transfer
learning model using TensorFlow/Keras, trains it with data augmentation, and saves the
trained model as skin_model.h5 in the backend folder.
"""

import argparse
import logging
import sys
from pathlib import Path

import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator


BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / 'processed_dataset'
MODEL_PATH = BASE_DIR / 'skin_model.h5'
IMG_SIZE = (224, 224)
DEFAULT_BATCH_SIZE = 32
DEFAULT_EPOCHS = 12
DEFAULT_VALIDATION_SPLIT = 0.2
SEED = 123


def configure_logging() -> None:
    """Configure logger output for the script."""
    logging.basicConfig(
        level=logging.INFO,
        format='[%(levelname)s] %(message)s',
        stream=sys.stdout,
    )


def validate_dataset(dataset_dir: Path) -> None:
    """Ensure the dataset path exists and contains at least one class folder."""
    if not dataset_dir.exists() or not dataset_dir.is_dir():
        raise FileNotFoundError(f'Dataset folder not found: {dataset_dir}')

    class_dirs = [child for child in dataset_dir.iterdir() if child.is_dir()]
    if not class_dirs:
        raise ValueError(f'No class subfolders found in {dataset_dir}.')

    logging.info('Found %d class folders in the dataset.', len(class_dirs))


def build_data_generators(
    dataset_dir: Path,
    img_size: tuple[int, int],
    batch_size: int,
    validation_split: float,
) -> tuple[ImageDataGenerator, ImageDataGenerator]:
    """Construct data generators for training and validation."""
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=20,
        zoom_range=0.15,
        horizontal_flip=True,
        validation_split=validation_split,
    )

    validation_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=validation_split,
    )

    train_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='training',
        shuffle=True,
        seed=SEED,
    )

    validation_generator = validation_datagen.flow_from_directory(
        dataset_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=False,
        seed=SEED,
    )

    return train_generator, validation_generator


def build_model(num_classes: int, img_size: tuple[int, int]) -> Model:
    """Build the MobileNetV2 transfer learning model."""
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(*img_size, 3),
    )

    # Freeze the base model so only the top classifier trains first.
    base_model.trainable = False

    inputs = Input(shape=(*img_size, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.4)(x)
    outputs = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs, outputs, name='skin_mobilenetv2')
    model.compile(
        optimizer=Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy'],
    )

    return model


def train_model(
    dataset_dir: Path,
    model_path: Path,
    epochs: int,
    batch_size: int,
    validation_split: float,
) -> None:
    """Train the model and save the best result to disk."""
    validate_dataset(dataset_dir)

    train_generator, validation_generator = build_data_generators(
        dataset_dir,
        IMG_SIZE,
        batch_size,
        validation_split,
    )

    class_names = list(train_generator.class_indices.keys())
    logging.info('Detected class names: %s', ', '.join(class_names))
    print('Detected class names:')
    for name in class_names:
        print(f'  - {name}')

    model = build_model(num_classes=len(class_names), img_size=IMG_SIZE)
    model.summary()

    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True,
            verbose=1,
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=2,
            verbose=1,
        ),
        ModelCheckpoint(
            filepath=str(model_path),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1,
        ),
    ]

    history = model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=epochs,
        callbacks=callbacks,
        verbose=1,
    )

    logging.info('Training finished. Best model saved to %s', model_path)
    if not model_path.exists():
        model.save(model_path)
        logging.info('Final model file created at %s', model_path)

    logging.info('Final training accuracy: %.4f', history.history.get('accuracy', [-1])[-1])
    logging.info('Final validation accuracy: %.4f', history.history.get('val_accuracy', [-1])[-1])


def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments for training configuration."""
    parser = argparse.ArgumentParser(
        description='Train a MobileNetV2 skin classifier with HAM10000 processed data.',
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=DEFAULT_EPOCHS,
        help='Number of training epochs.',
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help='Batch size used during training.',
    )
    parser.add_argument(
        '--validation-split',
        type=float,
        default=DEFAULT_VALIDATION_SPLIT,
        help='Fraction of training data used for validation.',
    )
    return parser.parse_args()


def main() -> int:
    configure_logging()
    args = parse_arguments()

    try:
        train_model(
            dataset_dir=DATASET_DIR,
            model_path=MODEL_PATH,
            epochs=args.epochs,
            batch_size=args.batch_size,
            validation_split=args.validation_split,
        )
        return 0
    except FileNotFoundError as error:
        logging.error(str(error))
        return 1
    except ValueError as error:
        logging.error(str(error))
        return 1
    except ImportError as error:
        logging.error('Missing dependency: %s', error)
        return 2
    except Exception as error:
        logging.exception('Unexpected error during training')
        return 3


if __name__ == '__main__':
    raise SystemExit(main())
