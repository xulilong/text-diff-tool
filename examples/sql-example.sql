-- 用户表创建脚本
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入示例数据
INSERT INTO users (username, email, password_hash, first_name, last_name, phone)
VALUES 
    ('zhangsan', 'zhangsan@example.com', 'hash123', '三', '张', '13800000000'),
    ('lisi', 'lisi@example.com', 'hash456', '四', '李', '13900000000'),
    ('wangwu', 'wangwu@example.com', 'hash789', '五', '王', '13700000000');

-- 查询活跃用户
SELECT 
    id,
    username,
    email,
    CONCAT(first_name, last_name) AS full_name,
    phone,
    created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

