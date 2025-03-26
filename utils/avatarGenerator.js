
const generateAvatar = (username) => {
    if (!username || typeof username !== 'string') {
        console.error("Invalid username received:", username);
        username = "User"; // Default fallback
    }
    
    const initials = username
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();
    
    return `https://ui-avatars.com/api/?name=${initials}&background=random&size=128`;
};

module.exports = generateAvatar;

