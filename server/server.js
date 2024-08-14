const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Student } = require('./models');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./Middleware/authMiddleware')

const app = express();
const PORT = 4000;
const DELAY = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Nếu bạn cũng xử lý JSON
app.use(cors());


const JWT_SECRET = 'demointernkey1123'; // Đặt secret của bạn ở đây


// Sử dụng middleware này cho các route cần bảo vệ
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Kiểm tra email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Routes
app.get('/students', authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Student.findAndCountAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'address', 'created_at', 'updated_at'],
      order: [['id', 'DESC']],
      limit: limit,
      offset: offset
    });

    res.json({
      students: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Lấy thông tin sinh viên theo ID
app.get('/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'address', 'created_at', 'updated_at']
    });

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/students', authenticateToken, async (req, res) => {
  const { first_name, last_name, email, address, password } = req.body;

  // Kiểm tra định dạng email
  if (!validateEmail(email)) {
    return res.status(422).send({
      error: {
        email: 'Email không đúng định dạng',
      },
    });
  }

  // Kiểm tra lỗi đặc biệt
  if (last_name === 'admin') {
    return res.status(500).send({
      error: 'Server bị lỗi',
    });
  }

  try {
    await Student.create({
      first_name,
      last_name,
      email,
      address,
      password
    });

    // Phản hồi khi thành công
    res.status(201).send({
      message: 'Sinh viên đã được thêm thành công',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Đã xảy ra lỗi khi thêm sinh viên'
    });
  }
});

app.patch('/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, address, password } = req.body;

  try {
    const student = await Student.findByPk(id);

    if (student) {
      await student.update({
        first_name,
        last_name,
        email,
        address,
        password // Lưu ý: Nếu có mã hóa mật khẩu, hãy thực hiện ở đây
      });

      res.json({ message: 'Thông tin sinh viên đã được cập nhật thành công' });
    } else {
      res.status(404).json({ error: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

  // Chuyển đổi ID từ string thành number nếu ID là kiểu số trong cơ sở dữ liệu
  const studentId = parseInt(id, 10);

  // Kiểm tra xem ID có phải là số hợp lệ không
  if (isNaN(studentId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  try {
    const result = await Student.destroy({
      where: { id: studentId } // Sử dụng studentId để tìm và xóa sinh viên
    });

    if (result) {
      res.status(200).json({ message: 'Sinh viên đã được xóa thành công' });
    } else {
      res.status(404).json({ error: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa sinh viên: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra email và mật khẩu
    const user = await Student.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      message: "Đăng nhập thành công!",
      accessToken: token,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Kết nối với cơ sở dữ liệu và khởi động server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
