// authController.js - Kullanıcı yetkilendirme (giriş, kayıt vb.) işlemlerini yöneten dosya.

// Gerekli modülleri içeri aktar.
const User = require("../models/User"); // Veritabanındaki 'Kullanıcı' modelini içeri aktar (Mongoose modeli).
const jwt = require("jsonwebtoken"); // JSON Web Token (JWT) oluşturmak için kullanılan kütüphane.

/**
 * Kimlik doğrulama token'ı (JWT) oluşturan yardımcı fonksiyon.
 * @param {string} id - Token içine eklenecek kullanıcı kimliği.
 * @returns {string} Oluşturulan JWT.
 */
const generateToken = (id) => {
    // Token içine kullanıcı ID’si ekleniyor.
    // process.env.JWT_SECRET → .env dosyasında tanımlı gizli anahtar ile imzalanıyor.
    // Token’in 1 saat (1h) geçerli olması sağlanıyor.
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// -------------------------------------------------------------------------

// Kullanıcı kayıt (Register) işlemini yöneten fonksiyon.
exports.registerUser = async (req, res) => {

    // İsteğin gövdesinden (formdan) gerekli bilgileri al.
    const { fullName, email, password, profileImageUrl } = req.body;

    // 1. Zorunlu alanların (Ad, E-posta, Şifre) kontrolünü yap.
    if (!fullName || !email || !password) {
        // Eksik alan varsa 400 (Bad Request) hatası dön ve mesajı gönder.
        return res.status(400).json({ message: "All Fields are required" });
    }
    
    try {
        // 2. E-posta adresinin veritabanında zaten kayıtlı olup olmadığını kontrol et.
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // E-posta zaten kullanılıyorsa 400 hatası dön.
            return res.status(400).json({ message: "Email already in use " })
        }

        // 3. Yeni kullanıcıyı veritabanına kaydet. (Model içindeki 'pre save' hook'ları şifreyi otomatik hash'leyecektir)
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        // 4. Başarılı kayıt sonrası 201 (Created) durum koduyla yanıt dön.
        res.status(201).json({
            id: user._id, // Kullanıcının DB kimliği
            user,        // Kullanıcının diğer bilgileri
            token: generateToken(user._id), // Giriş için yeni bir JWT oluştur ve gönder.
        });

    } catch (err) {
        // Hata yakalanırsa 500 (Internal Server Error) hatası dön.
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    }
};

// -------------------------------------------------------------------------

// Kullanıcı giriş (Login) işlemini yöneten fonksiyon.
exports.loginUser = async (req, res) => {
    // İsteğin gövdesinden (formdan) e-posta ve şifreyi al.
    const { email, password } = req.body;

    // 1. Zorunlu alanların (E-posta ve Şifre) kontrolünü yap.
    if (!email || !password) {
        // Eksik alan varsa 400 (Bad Request) hatası dön.
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // 2. Veritabanında verilen e-posta adresine sahip kullanıcıyı bul.
        // NOT: Koddaki 'user.findOne' yerine büyük harfli model adı 'User.findOne' olmalıdır.
        const user = await User.findOne({ email });

        // 3. Kullanıcı bulunamazsa VEYA şifre eşleşmezse (comparePassword fonksiyonu ile) hata dön.
        if (!user || !(await user.comparePassword(password))) {
            // 400 (Bad Request) hatası dönerek geçersiz kimlik bilgisi mesajı gönder.
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 4. Başarılı giriş sonrası 200 (OK) durum koduyla yanıt dön.
        res.status(200).json({
            id: user._id, // Kullanıcının DB kimliği
            user,        // Kullanıcının diğer bilgileri
            token: generateToken(user._id), // Giriş için yeni bir JWT oluştur ve gönder.
        });

    } catch (err) {
        // Hata yakalanırsa 500 (Internal Server Error) hatası dön.
        res
            .status(500)
            .json({ message: "Error logging in user", error: err.message });
    }
};

// -------------------------------------------------------------------------

// Giriş yapmış kullanıcının kendi profil bilgilerini almasını sağlayan fonksiyon.
// Bu fonksiyon, genellikle bir ara yazılımdan (middleware) sonra çalışır.
exports.getUserInfo = async (req, res) => {
    try {
        // 1. Ara yazılımın (middleware) eklediği kullanıcı ID'sini (req.user.id) kullanarak kullanıcıyı bul.
        // .select("-password") ile güvenlik için şifre alanını hariç tut.
        const user = await User.findById(req.user.id).select("-password");

        // 2. Kullanıcı bulunamazsa 404 (Not Found) hatası dön.
        if (!user) {
            return res.status(404).json({ message: "User not found " });
        }

        // 3. Kullanıcı bilgileri (şifresiz) başarıyla bulundu, 200 (OK) koduyla yanıtla.
        res.status(200).json(user);

    } catch (err) {
        // Hata yakalanırsa 500 (Internal Server Error) hatası dön.
        res
            .status(500)
            .json({ message: "Error fetching user information", error: err.message });
    }
};