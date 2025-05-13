export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};