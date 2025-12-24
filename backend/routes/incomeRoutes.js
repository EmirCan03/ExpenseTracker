// Express kütüphanesini projeye dahil ediyoruz
const express = require("express");

// Income (gelir) ile ilgili controller fonksiyonlarını içe aktarıyoruz
// addIncome        → Yeni gelir ekler
// getAllIncome     → Tüm gelirleri listeler
// deleteIncome     → Belirli bir gelir kaydını siler
// downloadIncomeExcel → Gelir listesini Excel olarak indirir
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/incomeController");

// Kullanıcı doğrulama (JWT token kontrolü) yapan middleware
const { protect } = require("../middleware/authMiddleware");

// Express router nesnesi oluşturuyoruz
const router = express.Router();

// Yeni gelir ekleme isteği (POST)
// protect middleware → Yetkisiz kullanıcı giremez
router.post("/add", protect, addIncome);

// Tüm gelirleri getirme isteği (GET)
// protect middleware → Kullanıcı giriş yapmış olmalı
router.get("/get", protect, getAllIncome);

// Gelirleri Excel olarak indirme isteği (GET)
// protect → Yine güvenlik kontrolü
router.get("/downloadexcel", protect, downloadIncomeExcel);

// Belirli bir gelir kaydını silme isteği (DELETE)
// :id → URL üzerinden gönderilen gelir ID'si
router.delete("/:id", protect, deleteIncome);

// Router'ı dışarıya aktarıyoruz
module.exports = router;
