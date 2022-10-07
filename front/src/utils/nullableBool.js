export const nullableBoolToString = (
    bool,
    trueString,
    falseString,
    nullString
) => {
    return bool === true
        ? trueString
        : bool === false
        ? falseString
        : nullString;
};
