"""Preprocess HAM10000 dataset for model training.

This script reads HAM10000 metadata, discovers the image files, and copies image files into
class-specific directories under backend/processed_dataset/. Original images are preserved.
"""

from collections import defaultdict
from csv import DictReader
from pathlib import Path
import shutil
from typing import Dict, List, Optional


ROOT_DIR = Path(__file__).parent
DATASET_DIR = ROOT_DIR / 'dataset'
METADATA_FILE = DATASET_DIR / 'HAM10000_metadata.csv'
IMAGE_DIRS = [
    DATASET_DIR / 'HAM10000_images_part_1',
    DATASET_DIR / 'HAM10000_images_part_2',
]
OUTPUT_DIR = ROOT_DIR / 'processed_dataset'

# Optional human-readable diagnosis mapping for summary output.
DX_FULL_NAMES: Dict[str, str] = {
    'nv': 'Melanocytic nevi',
    'mel': 'Melanoma',
    'bcc': 'Basal cell carcinoma',
    'akiec': 'Actinic keratoses',
    'bkl': 'Benign keratosis-like lesions',
    'df': 'Dermatofibroma',
    'vasc': 'Vascular lesions',
}

ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']


def read_metadata(metadata_path: Path) -> Dict[str, str]:
    """Read HAM10000 metadata and return a mapping from image_id to dx label."""
    if not metadata_path.exists():
        raise FileNotFoundError(f'Metadata file not found: {metadata_path}')

    image_labels: Dict[str, str] = {}
    with metadata_path.open(newline='', encoding='utf-8') as csvfile:
        reader = DictReader(csvfile)
        for row in reader:
            image_id = (row.get('image_id') or '').strip()
            dx = (row.get('dx') or '').strip().lower()
            if not image_id or not dx:
                continue

            existing_dx = image_labels.get(image_id)
            if existing_dx and existing_dx != dx:
                print(
                    f'Warning: conflicting labels for {image_id}: {existing_dx} vs {dx}. Using first label.'
                )
                continue

            image_labels[image_id] = dx

    return image_labels


def find_image_path(image_id: str, search_dirs: List[Path]) -> Optional[Path]:
    """Locate an image file for the given image_id in the provided dataset folders."""
    for data_dir in search_dirs:
        for extension in ALLOWED_EXTENSIONS:
            candidate = data_dir / f'{image_id}{extension}'
            if candidate.exists():
                return candidate
    return None


def make_class_directory(dx_label: str, output_root: Path) -> Path:
    """Return a directory path for the diagnosis label and create it if needed."""
    target_dir = output_root / dx_label
    target_dir.mkdir(parents=True, exist_ok=True)
    return target_dir


def copy_image_to_class(image_path: Path, class_dir: Path) -> Path:
    """Copy the image to the class folder while preserving the original file."""
    destination = class_dir / image_path.name
    shutil.copy2(image_path, destination)
    return destination


def build_processed_dataset() -> None:
    """Main preprocessing routine."""
    image_labels = read_metadata(METADATA_FILE)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    statistics: Dict[str, int] = defaultdict(int)
    missing_images: List[str] = []
    copied_images: int = 0

    for image_id, dx_label in sorted(image_labels.items()):
        image_path = find_image_path(image_id, IMAGE_DIRS)
        if image_path is None:
            missing_images.append(image_id)
            continue

        class_dir = make_class_directory(dx_label, OUTPUT_DIR)
        copy_image_to_class(image_path, class_dir)
        statistics[dx_label] += 1
        copied_images += 1

    print('\nHAM10000 preprocessing completed.')
    print(f'Total images discovered in metadata: {len(image_labels)}')
    print(f'Total images copied into {OUTPUT_DIR}: {copied_images}')
    print(f'Total missing images: {len(missing_images)}')

    if missing_images:
        print('\nMissing image IDs:')
        print(', '.join(missing_images[:20]) + ('...' if len(missing_images) > 20 else ''))

    print('\nClass distribution:')
    for dx_label, count in sorted(statistics.items(), key=lambda item: item[1], reverse=True):
        full_name = DX_FULL_NAMES.get(dx_label, 'Unknown diagnosis')
        print(f'  {dx_label:<6} ({full_name}): {count}')


if __name__ == '__main__':
    build_processed_dataset()
