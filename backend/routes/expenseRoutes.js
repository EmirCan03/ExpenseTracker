// Express kütüphanesini projeye dahil ediyoruz
const express = require("express");

const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require("../controllers/expenseController");

// Kullanıcı doğrulama (JWT token kontrolü) yapan middleware
const { protect } = require("../middleware/authMiddleware");

// Express router nesnesi oluşturuyoruz
const router = express.Router();

// protect middleware → Yetkisiz kullanıcı giremez
router.post("/add", protect, addExpense);

// protect middleware → Kullanıcı giriş yapmış olmalı
router.get("/get", protect, getAllExpense);

// protect → Yine güvenlik kontrolü
router.get("/downloadexcel", protect, downloadExpenseExcel);

// :id → URL üzerinden gönderilen gelir ID'si
router.delete("/:id", protect, deleteExpense);

// Router'ı dışarıya aktarıyoruz
module.exports = router;
