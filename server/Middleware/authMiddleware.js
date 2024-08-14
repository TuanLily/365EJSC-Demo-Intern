const jwt = require('jsonwebtoken');

const JWT_SECRET = 'demointernkey1123'; 

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Báo lỗi không có token hoặc token không hợp lệ
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token không hợp lệ
        }

        req.user = user; 
        next(); // Chuyển đến middleware hoặc route tiếp theo
    });
};



module.exports = authenticateToken;
