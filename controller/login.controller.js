exports.loginForm = async (req, res, next) => {
    try {
        
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        res.status(200).json({
            status: "succes",
            data: {
                post,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

exports.logout = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        res.status(200).json({
            status: "succes",
            data: {
                post,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};