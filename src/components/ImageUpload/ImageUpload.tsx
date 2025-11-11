import { useRef, type ChangeEvent, type FC } from "react";
import { useBase64Image } from "@hooks/useBase64Image";
import ImageIcon from "@assets/icons/imageIcon.svg?react";
import ClockIcon from "@assets/icons/clockIcon.svg?react";
import "./styles.css";
import styles from "./ImageUpload.module.css";

interface ImageUploadButtonProps {
  onImageUpload?: (imageUrl: string) => void;
  editor: any;
}

export const ImageUploadButton: FC<ImageUploadButtonProps> = ({ onImageUpload, editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleImageUpload, processing, error } = useBase64Image();

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Конвертируем в Base64
      const base64Image = await handleImageUpload(file);

      // Вставляем изображение в редактор
      if (editor && base64Image) {
        editor.chain().focus().setImage({ src: base64Image }).run();
      }

      // Вызываем callback
      onImageUpload?.(base64Image);

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error handling image upload:", err);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.ImageUpload}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/jpeg,image/png,image/gif,image/webp'
        style={{ display: "none" }}
      />

      <button
        type='button'
        onClick={handleButtonClick}
        disabled={processing}
        className={styles.button}
        title='Загрузить изображение (Base64)'
      >
        {processing ? <ClockIcon /> : <ImageIcon />}
      </button>

      {error && <div className='upload-error'>{error}</div>}
    </div>
  );
};
