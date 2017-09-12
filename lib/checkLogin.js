var checkLogin = function(req, res, next) {
    if (req.session.sign) {
        console.log(req.session);
        return true;
    } else {
        return false;
    }
}

module.exports = checkLogin;