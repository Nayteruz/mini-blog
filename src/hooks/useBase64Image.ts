import { useState } from "react";

export const useBase64Image = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setProcessing(true);
      setError(null);

      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        const errorMsg = "Можно загружать только изображения";
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      // Проверяем размер файла (максимум 2MB для Base64)
      if (file.size > 2 * 1024 * 1024) {
        const errorMsg = "Размер изображения не должен превышать 2MB для Base64";
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setProcessing(false);
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        setProcessing(false);
        setError("Ошибка чтения файла");
        reject(new Error("Ошибка чтения файла"));
      };

      reader.readAsDataURL(file);
    });
  };

  const optimizeImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise(resolve => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      img.onload = () => {
        // Рассчитываем новые размеры
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем сжатое изображение
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем обратно в File
        canvas.toBlob(
          blob => {
            if (!blob) {
              resolve(file);
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // Оптимизируем изображение перед конвертацией
      const optimizedFile = await optimizeImage(file);
      const base64String = await convertToBase64(optimizedFile);
      return base64String;
    } catch (err) {
      console.error("Error processing image:", err);
      throw err;
    }
  };

  return {
    handleImageUpload,
    processing,
    error,
  };
};
