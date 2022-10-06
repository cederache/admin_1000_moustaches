export const sortBy = (array, criterial) => {
    return array.sort((a, b) => {
        if (a[criterial] == b[criterial]) {
            return 0;
        } else if (a[criterial] < b[criterial]) {
            return -1;
        }
        return 1;
    });
};
