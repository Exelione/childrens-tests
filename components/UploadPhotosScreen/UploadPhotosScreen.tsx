import React, { useState, ChangeEvent } from 'react';
import styles from './UploadPhotosScreen.module.scss';
import uploadImage from '../../public/images/uploadImage.png'
import updateImage from '../../public/images/updateImage.png'
import Image from 'next/image';
import { uploadPhotos } from '../../store/thunks/photosThunks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';


interface PhotoSlot {
    label: string;
    file?: File;
}

const initialPhotoSlots: PhotoSlot[] = [
    { label: 'Дом, дерево, человек' },
    { label: 'Несуществующее животное' },
    { label: 'Автопортрет' },
];

const UploadPhotosScreen: React.FC = () => {
    const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(initialPhotoSlots);
    const dispatch = useDispatch<AppDispatch>();

    const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFile = e.target.files[0];
            const updatedSlots = [...photoSlots];
            updatedSlots[index] = { ...updatedSlots[index], file: newFile };
            setPhotoSlots(updatedSlots);
        }
    };
     const handleUpdateClick = (index: number) => {
        document.getElementById(`fileInput-${index}`)?.click();
    };

    const allPhotosUploaded = photoSlots.every(slot => slot.file !== undefined);
    
    const handleNext = async () => {
        if (!allPhotosUploaded) return;

        try {
            // подготовим массив файлов для отправки
            const filesToUpload = photoSlots.map(slot => slot.file!) // ! — потому что мы проверили что все есть
            // вызов thunk с передачей файлов
            const taskId = await dispatch(uploadPhotos(filesToUpload)).unwrap();
            console.log('Получен task_id:', taskId);
            // тут можно перейти к следующему шагу или сохранить taskId в стейт/редукс
        } catch (err) {
            console.error('Ошибка при загрузке файлов:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Загрузите фотографии рисунков</div>

            <div className={styles.slotsContainer}>
                {photoSlots.map((slot, index) => (
                    <div key={index} className={styles.photoSlotWrapper}>
                        <div className={styles.photoSlot}>
                            {slot.file ? (
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={URL.createObjectURL(slot.file)}
                                        alt={slot.label}
                                        layout="responsive"
                                        width={100}
                                        height={100}
                                    />
                                     <Image onClick={() => handleUpdateClick(index)} className={styles.updateImage} src={updateImage} alt="Upload Image" />
                                    {/* Скрытый input для выбора файла */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id={`fileInput-${index}`}
                                        onChange={(e) => handleFileChange(index, e)}
                                    />
                                </div>
                            ) : (
                                <label className={styles.uploadLabel}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(index, e)}
                                        style={{ display: 'none' }}
                                    />
                                    <Image className={styles.uploadImage} src={uploadImage} alt="Upload Image" />
                                </label>
                            )}
                        </div>
                        <div className={styles.photoLabel}>{slot.label}</div>
                    </div>
                ))}
            </div>

            <div className={styles.footContainer}>
                <span>Шаг 1/3</span>
                <button
                    className={`${styles.button} ${!allPhotosUploaded ? styles.buttonDisabled : ''}`}
                    disabled={!allPhotosUploaded}
                    onClick={handleNext}
                >
                    Далее
                </button>
            </div>
        </div>
    );
};

export default UploadPhotosScreen;