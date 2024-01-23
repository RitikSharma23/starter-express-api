const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  profile_image: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  name: { type: String,required: [true, 'Name is required']},
  company_status: { type: Boolean, default: false },
  email: {
    type: String, 
    required: [true, 'Email is required'],
  },
  address:{type:String},
  aadharlink: { type: String, default: null },
  twitter: { type: String, default: null },
  gender: { type: String,   enum: ['Male', 'Female', 'Other',null], default: null },
  phone: { type: String, default: null},
  aadhar: { type: String, default: null},
  pan: { type: String, default: null},
  dob: { type: String, default: null },
  facebook: { type: String, default: null },
  panlink: { type: String, default: null },
  instagram: { type: String, default: null },
  is_profile: { type: Boolean, default: false },
  phone_verified: { type: Boolean, default: false },
  aadhaar_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  password:{type:String,required:true},
});



const User = mongoose.model('User', userSchema);
module.exports = User;


  
//   "0EmCEYhb8EYiz2ORDsHJSRrmaX82": {
//     "profile_image": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
//     "name": "",
//     "company_status": false,
//     "email": "",
//     "aadharlink": "",
//     "twitter": "",
//     "gender": "",
//     "phone": "",
//     "dob": "07-03-2984",
//     "facebook": "",
//     "panlink": "",
//     "aadhar": "",
//     "instagram": "",
//     "pan": "",
//     "all_tour": false,
//     "is_profile": false,
//     "phone_verified": false,
//     "aadhaar_verified": false,
//     "email_verified": false,
//     "company_apply": false,
//     "company_id": "",
//     "role": "User",
//   },

//   "tour": {
//   "chat": true,
//   "profile": true,
//   "update": true,
//   "invoice": true,
//   "newcompany": true,
//   "wishlists": true,
//   "dashboard": true
// },