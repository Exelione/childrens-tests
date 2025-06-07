import React, { useState, ChangeEvent } from 'react';
import styles from './UploadPhotosScreen.module.scss';
import uploadImage from '../../public/images/uploadImage.png'
import updateImage from '../../public/images/updateImage.png'
import Image from 'next/image';
import VectorArrow from '../../public/icons/VectorArrow.svg'
import { uploadPhotos } from '../../store/thunks/photosThunks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';



interface PhotoSlot {
    label: string;
    file?: File;
}
interface Props {
    onNext: () => void;
}
const initialPhotoSlots: PhotoSlot[] = [
    { label: 'Дом, дерево, человек' },
    { label: 'Несуществующее животное' },
    { label: 'Автопортрет' },
];

const UploadPhotosScreen = ({ onNext }: Props) => {
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

            const filesToUpload = photoSlots.map(slot => slot.file!)

            await dispatch(uploadPhotos(filesToUpload)).unwrap();
            onNext();
        } catch (err) {
            console.error('Ошибка при загрузке файлов:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Загрузите фотографии рисунков</div>
            <div className={styles.formats}>
                <p>
                    <span>!</span>
                    Допустимые форматы файлов: jpg, jpeg, png, pdf. Размер не более 5 Мб
                </p>
            </div>
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
                                    <Image
                                        onClick={() => handleUpdateClick(index)}
                                        className={styles.updateImage}
                                        src={updateImage}
                                        alt="Upload Image" />

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
                                    <Image
                                        className={styles.uploadImage}
                                        src={uploadImage} alt="Upload Image" />
                                </label>
                            )}
                        </div>
                        <div className={styles.photoLabel}>{slot.label}</div>
                    </div>
                ))}
            </div>

            <div className={styles.footContainer}>
                <span className={styles.step}>Шаг 1/3</span>
                <button
                    className={`${styles.button} ${!allPhotosUploaded
                        ? styles.buttonDisabled : ''}`}
                    disabled={!allPhotosUploaded}
                    onClick={handleNext}
                >
                    Далее <Image className={styles.arrow} src={VectorArrow} alt="Arrow" />
                </button>
            </div>
        </div>
    );
};

export default UploadPhotosScreen;