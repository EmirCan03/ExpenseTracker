// Multer kütüphanesini dahil ediyoruz.
// Multer, Express uygulamalarında dosya yükleme (multipart/form-data) işlemleri için kullanılır.
const multer = require('multer');

// Disk üzerinde dosyaların nasıl ve nereye kaydedileceğini belirliyoruz.
const storage = multer.diskStorage({
    // Yüklenen dosyaların kaydedileceği klasör
    destination: (req, file, cb) => {
        // cb: callback fonksiyonu (hata yoksa null, sonra klasör yolu)
        cb(null, 'uploads/'); // Dosyaları "uploads" klasörüne kaydeder
    },

    // Yüklenen dosyanın sunucuda hangi isimle kaydedileceğini belirliyoruz
    filename: (req, file, cb) => {
        // Dosya ismini benzersiz yapmak için zaman damgası ekliyoruz
        cb(null, `${Date.now()}-${file.originalname}`);
        // Örnek çıktı: 1729349850000-profile.png
    },
});

// Yüklenebilecek dosya türlerini filtrelemek için bir fonksiyon oluşturuyoruz
const fileFilter = (req, file, cb) => {
    // İzin verilen dosya türleri (MIME tipleri)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Eğer dosya tipi izin verilenler arasındaysa kabul et
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // true → dosya kabul edilir
    } else {
        // Eğer farklı bir dosya türü yüklenirse hata döndür
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
    }
};

// Multer middleware'ini oluşturuyoruz.
// storage: dosyaların nereye ve nasıl kaydedileceğini tanımlar
// fileFilter: yalnızca belirli formatları kabul eder
const upload = multer({ storage, fileFilter });

// Diğer dosyalarda kullanılabilmesi için export ediyoruz
module.exports = upload;
