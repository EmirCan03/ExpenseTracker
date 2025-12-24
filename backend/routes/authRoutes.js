const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getUserInfo,
}=require("../controllers/authController");
const upload =require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser",protect, getUserInfo);

// 🖼️ GÖRSEL YÜKLEME (profil resmi, vb.)
// upload.single("image") → formdan gelen "image" isimli tek bir dosyayı alır.
// Dosya yoksa 400 hatası döner, varsa dosya yolu oluşturulup döndürülür.
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        // Eğer dosya yüklenmemişse hata mesajı gönder
        return res.status(400).json({ message: "No file uploaded" });
    }

    // Dosyanın tam URL’sini oluşturuyoruz (örneğin http://localhost:5000/uploads/image.png)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Başarılı olursa, 200 OK ile dosya URL’sini JSON olarak döndür
    res.status(200).json({ imageUrl });
});

module.exports =router;
