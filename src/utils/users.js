const users = [];

//*---------- Add User ------------*
const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLocaleString();

    // Validate the data
    if (!username || !room) {
        return {
            error: "Username and room are required!"
        };
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // Validate username
    if (existingUser) {
        return {
            error: "Username is in use!"
        };
    }

    // Store user
    const user = {id, username, room};
    users.push(user);
    return {user};
};

//*---------- Remove User ------------*
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

//*---------- Get User ------------*
const getUser = (id) => {
    // const user = users.find((user) => {
    //     return id === user.id;
    // });
    // if (!user) {
    //     return {
    //         error: "User does not exist!"
    //     };
    // } else return {user};
    return users.find(user => user.id === id)
};

//*---------- Get Users In Room ------------*
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => room === user.room);
    if (!usersInRoom) return;
    return usersInRoom;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
