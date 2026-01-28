// Blur Calculation Utilities - Interactive Blur Effect

/**
 * Calculate blur amount based on cursor distance from center
 * @param {number} mouseX - Mouse X position
 * @param {number} mouseY - Mouse Y position
 * @param {DOMRect} rect - Bounding rectangle of the element
 * @param {number} minBlur - Minimum blur amount (px)
 * @param {number} maxBlur - Maximum blur amount (px)
 * @returns {number} - Calculated blur amount
 */
export const calculateBlurAmount = (mouseX, mouseY, rect, minBlur = 10, maxBlur = 25) => {
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    // Calculate distance from center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );

    // Calculate maximum possible distance
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    // Calculate ratio (0 = center, 1 = edge)
    const ratio = Math.max(0, Math.min(1, distance / maxDistance));

    // Interpolate between minBlur and maxBlur
    const blurAmount = maxBlur - (ratio * (maxBlur - minBlur));

    return Math.max(minBlur, blurAmount);
};
