const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require("express-validator");
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const ObjectId = require('mongoose').Types.ObjectId;


// @route   GET api/profile/me
// @desc    get current user profile
// @access  Private 
router.get("/me", auth, async (req, res) => {
  try{
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({ msg: 'There is no profile for this user'});
    }
    res.json(profile);
  } catch(err){
    console.log(err.message);
    res.status(500).send('Server Error for current user profile route');
  }
});

// @route   POST api/profile
// @desc    Create or Update current user profile
// @access  Private 
router.post('/', 
    [
      auth, 
      [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
      ] 
    ], 
    async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
      }

      // destructure the request
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
      } = req.body;
      
      // build profile objects
      const profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
      }

      // build social object
      profileFields.social = {}
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.twitter = twitter;
      if(facebook) profileFields.facebook = facebook;
      if(linkedin) profileFields.social.linkedin = linkedin;
      if(instagram) profileFields.social.instagram = instagram;

      try{
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile){
          //update
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }

        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

      } catch(err){
        console.log(err.message);
        res.status(500).send('Server Error for Create route.')
      }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req,res) => {
  try{

    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);

  } catch(err){
    console.log(err.message);
    res.status(500).send('Server Error for Get all profiles route.');
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req,res) => {
  try{
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({ msg: 'Profile not found.' });

    res.send(profile);
  } catch(err){
    console.log(err.message);

    if(err.kind = 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found.' });
    }
    res.status(500).send('Server Error for Get user ID route');
  }
})

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try{
    // @todo - remove user's posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findByIdAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error for Delete route.');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience',
  [ 
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Compnay is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty() 
    ]
  ],
  async (req,res) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description 
    }

    try{
      
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
      
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error for Experience field.');
    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('./experience/:exp_id', auth, async (req,res) => {
  try{
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); 

    await profile.save();
    
    res.status(200).json(profile);

  } catch(err) {
    console.error(err.message);
    console.error(500).send('Server Error');

  }
});


module.exports = router;
