// Mongoose kütüphanesini dahil ediyoruz.
// Bu kütüphane MongoDB ile çalışmamızı sağlar (veri modeli oluşturma vb.).
const mongoose = require("mongoose");

// bcryptjs kütüphanesini dahil ediyoruz.
// Bu kütüphane, parolaları hash'lemek (şifrelemek) ve karşılaştırmak için kullanılır.
const bcrypt = require("bcryptjs");

// Yeni bir kullanıcı şeması (model yapısı) tanımlıyoruz.
// Bu, MongoDB'de nasıl bir kullanıcı belgesi (document) oluşturulacağını belirtir.
const UserShema = new mongoose.Schema(
    {
        // Kullanıcının tam adı (zorunlu alan)
        fullName: { type: String, required: true },

        // Kullanıcının e-posta adresi (zorunlu ve benzersiz)
        email: { type: String, required: true, unique: true },

        // Kullanıcının parolası (zorunlu)
        password: { type: String, required: true },

        // Kullanıcının profil resmi (varsayılan olarak null)
        profileImageUrl: { type: String, default: null },
    },
    {
        // timestamps özelliği, her kayıt için "createdAt" ve "updatedAt" alanlarını otomatik ekler.
        timestamps: true
    }
);

// 🔐 KAYDETME ÖNCESİ PAROLA HASHLEME (Mongoose middleware)
// Kullanıcı kaydedilmeden hemen önce bu fonksiyon çalışır.
UserShema.pre("save", async function (next) {
    // Eğer parola alanı değiştirilmemişse, hashleme yapmadan devam et.
    if (!this.isModified("password")) return next();

    // Parolayı hash'liyoruz (10: saltRounds - karmaşıklaştırma seviyesi).
    this.password = await bcrypt.hash(this.password, 10);

    // İşlem tamamlandıktan sonra bir sonraki adıma geç.
    next();
});

// 🔍 PAROLA KARŞILAŞTIRMA METODU
// Kullanıcının girdiği parolayı veritabanındaki hash'lenmiş parolayla karşılaştırır.
UserShema.methods.comparePassword = async function (candidatePassword) {
    // bcrypt.compare() iki parolayı karşılaştırır (true/false döner).
    return await bcrypt.compare(candidatePassword, this.password);
};

// Şemayı "User" adında bir Mongoose modeline dönüştürüp dışa aktarıyoruz.
// Artık bu model ile kullanıcı oluşturabilir, silebilir, güncelleyebiliriz.
module.exports = mongoose.model("User", UserShema);
