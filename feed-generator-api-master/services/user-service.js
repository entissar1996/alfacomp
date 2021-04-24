const {
    getToken,
    comparePassword
} = require('../helpers/auth.helpers');
const ROLES = require('../helpers/user-validation').roles;

const register = User => async (u) => {

    const user = new User(u)
    try {
        const save = await user.save();
        if (save) {
            return ({
                status: "success",
                message: "user registred succssfully!!!",
                payload: save
            })
        }
    } catch (error) {
        return ({
            status: "failed",
            message: "User failed to register!!!",
            payload: error
        })
    }

}

const authenticate = User => async (email, password) => {

    if (!email && !password) {
        return ({
            status: "fail",
            message: "can't authenticate without credential",
            payload: null
        })
    }

    try {
        const user = await User.findOne({
            email: email
        }).populate('customer');
        if (comparePassword(password, user.password)) {
            const token = getToken(user);
            return ({
                status: "success",
                message: "user authenticated succssfully!!!",
                payload: {
                    user: user.toJSON(),
                    token: token
                }
            });
        } else {
            return ({
                status: "error",
                message: "Invalid email or password!!!",
                payload: null
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "user can't authenticate",
            payload: null
        });
    }
}

const getAllUser = User => async () => {
    try {
        let users = await User.find({}).populate('customer');
        if (users) {
            return ({
                status: "success",
                message: "all users",
                payload: users
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "error to get users",
            payload: null
        });
    }
}

const getUserById = User => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't get user without a given id`,
            payload: null
        });
    }
    try {
        let user = await User.findById(id);
        if (user) {
            return ({
                status: "success",
                message: `Get User with _id=${id}`,
                payload: user
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error to get user with _id=${id}`,
            payload: null
        });
    }
}


const updateUser = User => async (id, user) => {
    if (user === undefined || JSON.stringify(user) === "{}") {
        return ({
            status: "error",
            message: "You should send fullusername,phone and city",
            payload: null
        })
    }
    try {
        let updatedUser = await User.findByIdAndUpdate(id, user);
        if (updatedUser) {
            return ({
                status: "success",
                message: "User updated successfully",
                payload: await User.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "update user is failed",
            payload: error
        })
    }

}


const updateUserRole = User => async (id, role) => {
    roles = Object.values(ROLES);
    const isRoleValid = roles.includes(role);

    if (!isRoleValid) {
        return ({
            status: "error",
            message: "wrong Role",
            payload: null
        });
    }
   else {
        try {
            let user = await User.findById(id);
            if (user) {
                user.set({
                    role: role
                });
                await user.save();
                return ({
                    status: "success",
                    message: "User Role updated successfully",
                    payload: user
                })
            } else {
                return ({
                    status: "error",
                    message: "user not found, update role is failed",
                    payload: null
                })
            }

        } catch (error) {
            return ({
                status: "error",
                message: "Update user role is failed",
                payload: null
            })
        }
    }
}

const deleteUser = User => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't delete user without a given id`,
            payload: null
        });
    }
    try {
        let user = await User.deleteOne({_id:id});
        if (user) {
            return ({
                status: "success",
                message: `User with _id=${id} has deleted`,
                payload: user
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error to delete user with _id=${id}`,
            payload: null
        });
    }
}

const grantAccessToUser = User => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't grant access to user without a given id`,
            payload: null
        });
    }
    try {
        let user = await User.findById(id);
        if (user) {
            user.isGranted=true;
            user.role=ROLES.user;
            await user.save();
            return ({
                status: "success",
                message: `User is now granted to access`,
                payload: user
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error can't grant access to user`,
            payload: error
        });
    }
}


const assignUserToCustomer = User => Customer => async (userId, customerId) => {
    if(userId === undefined || customerId ===undefined){
        return ({
            status: "error",
            message: `Can't assign user to customer`,
            payload: null
        });
    }

    try {
        let user=await User.findById(userId);
        user.customer=customerId;
        await user.save();

        let customer=await Customer.findById(customerId);
        customer.users.push(userId);
        await customer.save();
        return({
            status: "success",
            message: `User assigned to Customer`,
            payload: {
                user:user,
                customer:customer
            }
        })

        
    } catch (error) {
        return ({
            status: "error",
            message: `Error can't assign User to Customer`,
            payload: error
        });
        
    }
}

module.exports = (User) => {
    return {
        register: register(User),
        authenticate: authenticate(User),
        getAllUsers: getAllUser(User),
        getUserById: getUserById(User),
        updateUser: updateUser(User),
        updateUserRole: updateUserRole(User),
        deleteUser: deleteUser(User),
        grantAccessToUser: grantAccessToUser(User),
        assignUserToCustomer: assignUserToCustomer(User)
    }
}