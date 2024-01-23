const {verifyToken}=require("../middleware/middleware")
const User=require("../Models/user")

module.exports = async function(app, db, admin, firebase) {


    app.post("/check-eligibility", verifyToken, async function(req, res) {
        user=await fun.getUserDetails(req.user.uid)

        if(!user.is_profile){
            return res.json({ status: false,msg:'Please Complete Your Profile' })

        }else if(!user.email_verified){
            return res.json({ status: false,msg:'Please Verify Your Email' })

        }else if(!user.phone_verified){
            return res.json({ status: false,msg:'Please Verify Your Phone' })

        }else if(!user.aadhaar_verified){
            return res.json({ status: false,msg:'Please Verify Your Aadhar' })

        }else{
            return res.json({ status: true })
        }
    });

    
    app.get("/user-company-details", verifyToken, async function(req, res) {
      return res.json({status:true,data:await Company.find({admin_id:req.user.uid}).exec()})
    });


    app.post("/add-new-company", verifyToken, async function(req, res) {
        const user = await fun.getUserDetails(req.user.uid);
        console.log(req.body)
        if(!user.company_apply){
            const data = req.body;
            data.admin_id = req.user.uid;
            data.branch_name = 'main';
    
            console.log(data);
    
            const newCompany = new Company({...data});
            const company = await newCompany.save();
    
            await new Settings({
                company_id: company._id,
                incorporation_number:req.body.incorporation_number,
                incorporation_pdf:req.body.incorporation_pdf,
                gst:req.body.gst,
                udyog_number:req.body.udyog_number,
                udyog_pdf:req.body.udyog_pdf,
            }).save();
    
            const result = await User.updateOne(
                { _id: req.user.uid },
                { $set: { company_apply: true,company_id:company._id } }
            );

        fun.sendNotification(req.user.uid,"Company Applied","Congrulations You Have Successfully Applied For New Company","success")
        fun.sendDeskopMessage("superadmin","New Company Applied","A New User Has Applied For A Company","success")

            return res.json({status: true, company_id: company._id});
        }else{
            return res.status(500).json({status: false, msg: 'Already Applired For A Company'});
        }
    });


    app.post("/company-reapply", verifyToken, async function(req, res) {
        const user = await fun.getUserDetails(req.user.uid);
        const result = await Company.updateOne(
            { _id: user.company_id },
            { $set: {status:3, ...req.body } }
        );
        fun.sendNotification(req.user.uid,"Application Modified","You Will Get Modified","success")
        fun.sendDeskopMessage("superadmin","Application Reapplied","A New User Has Reapplied Company Application","success")

        return res.json({status: true});
    });
    
    app.post("/check-status", verifyToken, async function(req, res) {
        user=await fun.getUserDetails(req.user.uid)
        console.log(req.user)
        Company.findById(user.company_id).exec()
       
        .then(async company => {

            if(company.status==1){
                return res.json({status:true,status:1,msg:'Your Request Processes Successfully Please Relogin'})
            }else if(company.status==2){
                return res.json({status:true,status:2,msg:company.comment})
            }else{
                return res.json({status:true,status:3,msg:'Your Request Is Under Process'})
            }
        })

    });



   

 //Appointments
    app.get('/appointment/:company_id', verifyToken, async (req, res) => {
      console.log(req.user)
      return res.json({
        status: true,
        data: await Appointment.find({ company_id: req.params.company_id,user_email: req.user.email }).exec(),
      });
    });

    app.get('/appointment-user/:apointment_Id', verifyToken, async (req, res) => {
      return res.json({
        status: true,
        data: await Appointment.find({ _id:req.params.apointment_Id}).exec(),
      });
    });

    app.post('/appointment-add/:id', verifyToken, async (req, res) => {
      try {

        req.body.company_id = req.params.company_id;
        console.log(req.user)
        req.body.status="pending";
        req.body.event_type="appointment";
        req.body.by_role=req.user.role;
        req.body.created_by=req.user.uid;

        const newApointment = new Appointment({ ...req.body });
        await newApointment.save();
        return res.json({ status: true });
      } catch (error) {
        return res.json({ status: false, msg: error });
      }
    });

    app.post('/calender-add/:id', verifyToken, async (req, res) => {
      try {

        req.body.company_id = req.user.company_id;
        console.log(req.user)
        req.body.status="pending";
        req.body.event_type="calender";
        req.body.by_role=req.user.role;
        req.body.created_by=req.user.uid;

        const newApointment = new Appointment({ ...req.body });
        await newApointment.save();
        return res.json({ status: true });
      } catch (error) {
        return res.json({ status: false, msg: error });
      }
    });

    app.get('/user-personal-chat/:Id/:role', verifyToken, async (req, res) => {
      try {
        let id = (req.params.Id + req.user.uid).split('').sort().join('')
        c = await Chats.find({ user_id: req.user.uid, receiver_id: req.params.Id })
        if(c.length==0){
          var newChat = new Chats({ type: req.params.role, receiver_id: req.params.Id, user_id: req.user.uid,chat_id:id});
          await newChat.save();
          var newChat = new Chats({ type: req.params.role, receiver_id: req.user.uid, user_id: req.params.Id ,chat_id:id});
          await newChat.save();
        }
        
        return res.json({status: true});
      } catch (error) {
        return res.json({ status: false,msg: error.message });
      }
    });


  //wishlist
    app.get('/user-wishlist/', verifyToken, async (req, res) => {
      try {
        const wishlist = await WishlistModel.find({ user_id: req.user.uid })
          .populate({ path: 'company_id', model: 'Company' })
          .exec();
    
        if (wishlist && wishlist.length > 0) {
          res.json({ status: true, data: wishlist });
        } else {
          res.json({ status: false, msg: 'No wishlist items found.' });
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
      }
    });

    app.post('/add-user-wishlist/',verifyToken, async (req, res) => {
      try {
        req.body.user_id=req.user.uid

        const existingItem = await WishlistModel.findOne({company_id:req.body.company_id});

        if (existingItem) {
          return res.json({ status: false, msg: 'Wishlist item already exists for this company.' });
        }
    
        const newWishlist = new WishlistModel(req.body);
        const savedItem = await newWishlist.save();
        res.json({ status: true, data: savedItem });
      } catch (error) {
        console.error('Error adding item to wishlist:', error);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
      }
    });

    app.delete('/remove-user-wishlist/:itemId', verifyToken, async (req, res) => {
      try {
        const userId = req.user.uid;
        const itemId = req.params.itemId;
        const deletedItem = await WishlistModel.findOneAndDelete({ _id: itemId, user_id: userId });
    
        if (deletedItem) {
          res.json({ status: true, msg: 'Item removed from wishlist.' });
        } else {
          res.status(404).json({ status: false, msg: 'Item not found in the wishlist.' });
        }
      } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
      }
    });

  

};
    
    