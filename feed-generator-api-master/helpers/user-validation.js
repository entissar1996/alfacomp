var jwt = require('jsonwebtoken');
var secretKey = require('../config/credentials').secret_key;
module.exports = {
    validateUser: async function (req, res, next) {
        await jwt.verify(req.headers['x-access-token'], secretKey, function (err, decoded) {
            if (err) {
                res.json({
                    status: "error",
                    message: err.message,
                    data: null
                });
            } else {
                // add user id to request
                req.body.logged={
                    userid : decoded.id,
                    email : decoded.email,
                    role : decoded.role,
                    isGranted :decoded.isGranted
                }
                next();
            }
        });
    },
    isAdmin: async function (req, res, next) {
        if (req.body.logged.role !== "ADMIN") {
            res.json({
                status: "error",
                message: "error You are not allowed You are not Administrator",
                payload: null
            });
        } else {
            next();
        }
    },
    isGranted: async function (req, res, next) {
        if (req.body.logged.isGranted !== true) {
            res.json({
                status: "error",
                message: "error You are not allowed you'r access not granted yet",
                payload: null
            });
        } else {
            next();
        }
    },

    isSupervisor: async function (req, res, next) {
        if (req.body.logged.role !== "SUPERVISOR") {
            res.json({
                status: "error",
                message: "error You are not allowed You are not Supervisor",
                payload: null
            });
        } else {
            next();
        }
    },
    roles: {
        admin: "ADMIN",
        guest: "GUEST",
        supervisor: "SUPERVISOR",
        user: "USER"
    }
}