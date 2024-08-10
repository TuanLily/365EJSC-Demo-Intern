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
    // Thêm dữ liệu vào CSDL
    const newStudent = await Student.create({
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


// Kết nối với cơ sở dữ liệu và khởi động server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
