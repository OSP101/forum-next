# J Forum

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Next.JS](https://img.shields.io/badge/Next.JS-20232A?style=for-the-badge&logo=Next.JS&logoColor=FFFFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-20232A?style=for-the-badge&logo=TailwindCSS&logoColor=61DAFB)

**ผู้พัฒนา: OSP101**  
**สื่อประกอบการสอนวิชา SC363204 Java Web Application Development**  
**สงวนลิขสิทธิ์**

---

## 📖 เกี่ยวกับโปรเจกต์

ระบบเจฟอรัม (J Forum) เป็นส่วนหนึ่งของสื่อการสอนวิชา Java Web Application Development โดยใช้เทคโนโลยีต่อไปนี้:

- **Backend:** Spring Boot
- **Frontend:** Next.JS + TailwindCSS

---

## 🚀 การติดตั้งและรันโปรเจกต์

### ขั้นตอนที่ 1: Clone repository จาก GitHub
```bash
git clone https://github.com/OSP101/forum-next.git
```

### ขั้นตอนที่ 2: เปลี่ยนตำแหน่งไปยังโฟลเดอร์ `forum-next-main`
```bash
cd forum-next-main
```
### ขั้นตอนที่ 3: ติดตั้งแพ็คเกจที่จำเป็น
```bash
npm install
```
### ขั้นตอนที่ 4: แก้ไขไฟล์ `.env.local`
สร้างไฟล์ `.env.local` ไว้ที่ root และกรอกดังนี้:
```bash
NEXT_PUBLIC_API_URL=http://your-api-url
```
### ขั้นตอนที่ 5: รันโปรเจกต์
```bash
npm run dev
```
จากนั้นเปิดเบราว์เซอร์และไปที่ ``http://localhost:3000``

---

## 🛠️ โครงสร้างข้อมูล API

### 1. Get all forum
- Method: GET
- Endpoint: /api/v1/forum
- Parameters

  Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  forum | Array | ข้อมูลฟอรัม

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  id | Int | ไอดีของฟอรัม
  author | String | ชื่อผู้เขียนฟอรัม
  detail | String | รายละเอียดข้อมูลฟอรัม
  love | Int | จำนวนหัวใจฟอรัม
  date | String | วัน เวลาที่สร้างฟอรัม


- Body:
```json
{
    "forum": [
        {
            "id": 1,
            "author": "OSP101",
            "detail": "I like the JavaScript framework called NextJS.",
            "love": 1002,
            "date": "2025-02-10T17:00:00"
        },
        {
            "id": 5,
            "author": "JK",
            "detail": "I like the Java framework called Spring.",
            "love": 10001,
            "date": "2025-02-10T17:00:00"
        },
    ],
}
```

### 2. Get forum by ID
- Method: GET
- Endpoint: /api/v1/forum/${id}
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  id | Int | ไอดีของฟอรัม
  author | String | ชื่อผู้เขียนฟอรัม
  detail | String | รายละเอียดข้อมูลฟอรัม
  love | Int | จำนวนหัวใจฟอรัม
  date | String | วัน เวลาที่สร้างฟอรัม

- Body:
```json
{
  "id": 1,
  "author": "OSP101",
  "detail": "I like the JavaScript framework called NextJS.",
  "love": 1002,
  "date": "2025-02-10T17:00:00"
}
```

### 3. Create forum
- Method: POST
- Endpoint: /api/v1/forum
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  author | String | ชื่อผู้เขียนฟอรัม
  detail | String | รายละเอียดข้อมูลฟอรัม
  love | Int | จำนวนหัวใจฟอรัม

- Body:
```json
{
  "author": "OSP101",
  "detail": "I like the JavaScript framework called NextJS.",
  "love": 0,
}
```

### 4. Update forun
- Method: PUT
- Endpoint: /api/v1/forum/${id}
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  author | String | ชื่อผู้เขียนฟอรัม
  detail | String | รายละเอียดข้อมูลฟอรัม

- Body:
```json
{
  "author": "OSP101",
  "detail": "I like the JavaScript framework called NextJS."
}
```

### 5. Update love state
- Method: PATCH
- Endpoint: /api/v1/forum/${id}/love


### 6. Delete customer
- Method: DELETE
- URL: /api/v1/forum/${id}

---
## 📞 ติดต่อผู้พัฒนา
หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถติดต่อได้ที่:
OSP101

---

## 📜 ใบอนุญาต
โปรเจกต์นี้เป็นส่วนหนึ่งของสื่อการสอนวิชา SC363204 Java Web Application Development และสงวนลิขสิทธิ์โดย OSP101

---

### ตัวอย่างการแสดงผล:

![ตัวอย่าง README](https://firebasestorage.googleapis.com/v0/b/computer-e84a8.appspot.com/o/images%2Fnext-forum.png?alt=media&token=0927fc5e-d987-4f32-9cf1-d2aa35de75e1)
