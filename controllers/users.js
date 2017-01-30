var mongoose = require('mongoose');
var User = mongoose.model('User');
var passwordHash = require('password-hash');

//GET - Return all Users in the DB
User.findAllUsers = function (req, res) {
    User.find(function (err, users) {
        if (err)
            res.send(500, err.message);

        console.log('GET /users')
        res.status(200).jsonp(users);
    });
};
User.login = function (req, res) {
    var email = req.params.email;
    var password = req.params.password;
    console.log(email);
    User.findOne({"email": email}, function (err, user) {
        if (err)
            return res.status(500).send(err.message);
        if (!user)
            return res.status(500).send('User not found');
        if (passwordHash.verify(password, user.password))
            res.status(200).jsonp(user);
        else
            return res.status(500).send('Password incorrect');

    })
}
//GET - Return a User with specified ID
User.findById = function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err)
            return res.status(500).send(err.message);

        console.log('GET /user/' + req.params.id);
        res.status(200).jsonp(user);
    });
};

//POST - Insert a new User in the DB
User.addUser = function (req, res) {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location,
        description: req.body.description
    });

    user.save(function (err, user) {
        if (err)
            return res.status(500).send(err.message);
        res.status(200).jsonp(user);
    });
};

//PUT - Update a register already exists
User.updateUser = function (req, res) {
    User.findOne({_id:req.params.id}, function (err, user) {
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.location = req.body.location;
        user.description = req.body.description;
        user.save(function (err) {
            if (err)
                return res.status(500).send(err.message);
            console.log('PUT /users/'+req.params.id)
            res.status(200).send('user saved');
        });
    });
};


//DELETE - Delete a TVShow with specified ID
User.deleteUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        user.remove(function (err) {
            if (err)
                return res.status(500).send(err.message);
            res.status(200).send();
        })
    });
};

//GET - Find near
// SELECT id, ( 3959 * acos( cos( radians(37) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(-122) ) + sin( radians(37) ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < 25 ORDER BY distance LIMIT 0 , 20;
User.getNear = function (req, res) {
    var lat = parseFloat(req.params.lat);
    var lng = parseFloat(req.params.lng);
    User.find({location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                $maxDistance: 1000
            }}}
    , function (err, users) {
        if (err)
            res.status(500).send(err.message);

        console.log('GET /users/near')
        res.status(200).jsonp(users);
    })
}