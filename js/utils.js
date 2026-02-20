export const isArrayEmpty = (array) =>
    Array.isArray(array) &&
    (array.length === 0 || array.every(item => !item?.trim()));

export const fetchJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
};

export const fadeOut = (element, duration) =>
    new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        setTimeout(resolve, duration);
    });

export const fadeIn = (element, duration) => {
    element.style.transition = `opacity ${duration}ms`;
    element.style.opacity = '1';
};

export const replaceClass = (element, oldClass, newClass) => {
    if (element) {
        element.classList.replace(oldClass, newClass);
    }
};
