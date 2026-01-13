# Bus Driver Management System
## Giới thiệu
"Bus Driver Management System" là hệ thống quản lý lái xe bus, được xây dựng nhằm hỗ trợ:
- Quản lý thông tin lái xe
- Quản lý tuyến xe
- Phân công lái xe theo ngày
- Tính lương, chi phí nhiên liệu, doanh thu
- Thống kê theo thời gian, tuyến xe và lái xe

Hệ thống phục vụ cho mục đích học tập / đồ án môn học, mô phỏng nghiệp vụ quản lý vận tải hành khách.

---
## Công nghệ sử dụng
### Backend
- Java 17
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Maven
### Frontend
- JavaScript
- HTML, CSS  
### Database
- MySQL
- Cơ sở dữ liệu quan hệ
- Ràng buộc khóa chính – khóa ngoại rõ ràng
---
## Cấu trúc thư mục
Bus_Driver_Management_System/
├── backend/ # Spring Boot Backend
│ ├── controller
│ ├── service
│ ├── repository
│ ├── model
│ └── security
│
├── frontend/ # Giao diện người dùng
│
├── database/ # Script SQL, thiết kế CSDL
│
├── .gitignore
└── README.md

---
## Chức năng chính
- Quản lý lái xe
- Quản lý tuyến xe
- Phân công lái xe – tuyến xe – ngày chạy
- Tính toán:
  - Lương lái xe
  - Chi phí nhiên liệu
  - Doanh thu
- Thống kê:
  - Theo ngày / tháng
  - Theo tuyến xe
  - Theo lái xe
- Xác thực và phân quyền người dùng bằng JWT
---
## Hướng dẫn chạy Backend
### Chuẩn bị database
Tạo database MySQL:
```sql
CREATE DATABASE bus_driver_db;

Cấu hình biến môi trường
- DB_USERNAME
- DB_PASSWORD
- JWT_SECRET

### Chạy backend
cd backend
mvn spring-boot:run
