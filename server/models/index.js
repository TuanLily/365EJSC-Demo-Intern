const { Sequelize, DataTypes } = require('sequelize');

// Khởi tạo Sequelize với cấu hình kết nối MySQL
const sequelize = new Sequelize('365ejsc-demo-intern', 'root', 'mysql', {
    host: 'localhost',
    dialect: 'mysql',
});

const Student = sequelize.define('Student', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Email không đúng định dạng',
            },
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true, // Có thể null
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Giá trị mặc định là thời gian hiện tại
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Giá trị mặc định là thời gian hiện tại
    },
}, {
    tableName: 'students',
    timestamps: false, // Tắt tính năng tự động thêm `createdAt` và `updatedAt` của Sequelize
});

module.exports = { sequelize, Student };
