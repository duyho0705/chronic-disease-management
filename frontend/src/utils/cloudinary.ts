/**
 * Cloudinary Upload Helper
 * Chuyên xử lý việc upload ảnh trực tiếp từ Frontend lên Cloudinary
 */

const CLOUD_NAME = "dymtwm6ix"; // Đã cập nhật từ dashboard của bạn
const UPLOAD_PRESET = "ml_default"; // Đã cài đặt thành công

export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Upload to Cloudinary failed');
        }

        const data = await response.json();
        return data.secure_url; // Trả về link https của ảnh
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};
