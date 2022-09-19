const makeId = () => {
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charsLength = chars.length;
    for(let i = 0; i < 5; i++)
    {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
};

module.exports = {
    makeId,
};
