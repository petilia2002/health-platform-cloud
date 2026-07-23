# from ultralytics import YOLO
# import cv2
# from PIL import Image
# import os
# from pathlib import Path
# import uuid

# from app.core.config import UPLOAD_FOLDER


# class YOLOFaceDetector:
#     def __init__(self):
#         # Модель YOLO для обнаружения лиц
#         model_path = Path(__file__).resolve().parent / "yolov8n-face.pt"
#         self.model = YOLO(str(model_path))  # Специальная модель для лиц

#     def _generate_unique_filename(self, ext: str):
#         return f"{uuid.uuid4().hex}.{ext}"

#     def detect_face(self, image_path):
#         results = self.model(image_path)

#         if len(results[0].boxes) == 0:
#             print("Лица не обнаружены YOLO")
#             img = cv2.imread(image_path)
#             return self._center_crop(img)

#         # Берем самый большой bbox
#         boxes = results[0].boxes.xyxy.cpu().numpy()
#         largest_box = max(boxes, key=lambda box: (box[2] - box[0]) * (box[3] - box[1]))

#         x1, y1, x2, y2 = map(int, largest_box)
#         img = cv2.imread(image_path)

#         # Расширяем область
#         w, h = x2 - x1, y2 - y1
#         expansion = 0.6

#         x1_exp = max(0, x1 - int(w * expansion))
#         y1_exp = max(0, y1 - int(h * expansion))
#         x2_exp = min(img.shape[1], x2 + int(w * expansion))
#         y2_exp = min(img.shape[0], y2 + int(h * expansion))

#         cropped = img[y1_exp:y2_exp, x1_exp:x2_exp]
#         return cropped

#     def _center_crop(self, img):
#         """Центрированная обрезка если лицо не найдено"""
#         height, width = img.shape[:2]
#         crop_size = min(height, width)

#         y = (height - crop_size) // 2
#         x = (width - crop_size) // 2

#         return img[y : y + crop_size, x : x + crop_size]

#     def create_icon(self, image_path, out_dir, output_size=(200, 200)):
#         """Создает иконку (прямоугольную, без округления)"""
#         try:
#             cropped_face = self.detect_face(image_path)

#             cropped_face_rgb = cv2.cvtColor(cropped_face, cv2.COLOR_BGR2RGB)
#             pil_image = Image.fromarray(cropped_face_rgb)
#             pil_image = pil_image.resize(output_size, Image.Resampling.LANCZOS)

#             filename = self._generate_unique_filename("png")
#             output_path = os.path.join(UPLOAD_FOLDER, out_dir, filename)

#             pil_image.save(output_path, "PNG", quality=95)

#             print(f"✅ Иконка создана: {output_path}")
#             return filename

#         except Exception as e:
#             print(f"❌ Ошибка: {e}")
#             return None


# detector = YOLOFaceDetector()

import shutil
from pathlib import Path
import uuid

from app.core.config import UPLOAD_FOLDER


class PhotoCropper:
    def __init__(self):
        pass

    def _generate_unique_filename(self, ext: str):
        return f"{uuid.uuid4().hex}.{ext}"

    def create_icon(self, image_path: str, out_dir: str) -> str | None:
        try:
            image_path = Path(image_path)
            # Берём расширение исходного файла (например, '.jpg')
            ext = image_path.suffix.lower().lstrip(".")
            if not ext:
                ext = "png"

            filename = self._generate_unique_filename(ext)
            output_path = UPLOAD_FOLDER / out_dir / filename
            # Создаём папку назначения, если её нет
            output_path.parent.mkdir(parents=True, exist_ok=True)

            # Копируем файл
            shutil.copy2(str(image_path), str(output_path))
            return filename
        except Exception as e:
            print(f"❌ Ошибка при создании иконки: {e}")
            return None


detector = PhotoCropper()
