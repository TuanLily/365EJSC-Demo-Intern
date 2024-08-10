const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Student } = require('./models');
const cors = require('cors'); // Thêm dòng này

const app = express();
const PORT = 4000;
const DELAY = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Kiểm tra email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Routes
app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'address', 'created_at', 'updated_at'],
      order: [['id', 'DESC']]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/students', async (req, res) => {
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

app.delete('/students/:id', async (req, res) => {
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


// Kết nối với cơ sở dữ liệu và khởi động server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
