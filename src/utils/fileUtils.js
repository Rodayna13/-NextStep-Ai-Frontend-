/**
 * Validates if a file is an image
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is an image
 */
export const isImageFile = (file) => {
    return file && file.type.startsWith('image/');
};

/**
 * Reads an image file and returns a promise with the data URL
 * @param {File} file - The image file to read
 * @returns {Promise<{url: string, name: string}>} - Promise resolving to image data
 */
export const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
        if (!isImageFile(file)) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            resolve({
                url: event.target.result,
                name: file.name
            });
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
};
