const User=require("../Models/user.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verifyToken}=require("../middleware/middleware.js")


module.exports=async function(app, db, admin,firebase) {

    const routers = [
        require("./profile.js"),
    ];

    routers.forEach(router => {
        router(app, db, admin,firebase);
    });

    

    app.get('/user-dashboard', verifyToken, async function (req, res) {

        logs = await Logs.find({ user_id: req.user.uid })
            .sort({ time: -1 }).exec()

        return res.json({
            status: true,logs: logs
        });
    });


    app.get('/testapi', async function (req, res) {
        return res.json({
            status: true,msg: 'api is working'
        });
    });



    app.get('/user-dashboarde', verifyToken, async function (req, res) {

        logs = await Logs.find({ user_id: req.user.uid })
            .sort({ time: -1 }).exec()

        return res.json({
            status: true,logs: logs
        });
    });

    app.put('/close-tour', verifyToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.uid);
            user.tour[req.body.field] = true;
            Object.assign(user, req.body);
            await user.save();
            return res.json({ status: true,user: user });
        } catch (error) {
            console.error(error);
            res.json({ status: false, msg: error.message });
        }
    });


}