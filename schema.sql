-- ==============================================================================
-- ENGLISH GAMIFIED LESSON STUDIO - POSTGRESQL SCHEMA & SEED DDL
-- Compatible with PostgreSQL 13+, Neon, Supabase, AWS RDS, Docker
-- Naming convention: snake_case for tables and columns
-- ==============================================================================

-- 1. Create table: nguoi_dung
CREATE TABLE IF NOT EXISTS nguoi_dung (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(150) NOT NULL,
    vai_tro VARCHAR(50) DEFAULT 'TEACHER' NOT NULL,
    trang_thai SMALLINT DEFAULT 1 NOT NULL,
    tao_luc TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cap_nhat_luc TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nguoi_dung_email ON nguoi_dung (email);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_vai_tro ON nguoi_dung (vai_tro);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_trang_thai ON nguoi_dung (trang_thai);

-- 2. Create table: nguoi_dung_thiet_bi (JWT session tracking & device management)
CREATE TABLE IF NOT EXISTS nguoi_dung_thiet_bi (
    id SERIAL PRIMARY KEY,
    nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung (id) ON DELETE CASCADE,
    device_id VARCHAR(128) NOT NULL,
    jwt_token VARCHAR(512) NOT NULL,
    het_han_luc TIMESTAMPTZ NOT NULL,
    hoat_dong BOOLEAN DEFAULT TRUE NOT NULL,
    tao_luc TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nguoi_dung_thiet_bi_nguoi_dung_id ON nguoi_dung_thiet_bi (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_thiet_bi_device_id ON nguoi_dung_thiet_bi (device_id);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_thiet_bi_het_han_luc ON nguoi_dung_thiet_bi (het_han_luc);

-- 3. Create table: bai_giang
CREATE TABLE IF NOT EXISTS bai_giang (
    id SERIAL PRIMARY KEY,
    nguoi_dung_id INTEGER NOT NULL REFERENCES nguoi_dung (id) ON DELETE CASCADE,
    ma_bai_giang VARCHAR(20) UNIQUE NOT NULL,
    tieu_de VARCHAR(255) NOT NULL,
    khoi_lop SMALLINT NOT NULL,
    chu_de VARCHAR(150) NOT NULL,
    thoi_luong_phut INTEGER DEFAULT 45 NOT NULL,
    cau_hinh_trinh_chieu JSONB,
    trang_thai SMALLINT DEFAULT 1 NOT NULL,
    tao_luc TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cap_nhat_luc TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bai_giang_nguoi_dung_id ON bai_giang (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_bai_giang_ma_bai_giang ON bai_giang (ma_bai_giang);
CREATE INDEX IF NOT EXISTS idx_bai_giang_khoi_lop ON bai_giang (khoi_lop);
CREATE INDEX IF NOT EXISTS idx_bai_giang_chu_de ON bai_giang (chu_de);
CREATE INDEX IF NOT EXISTS idx_bai_giang_trang_thai ON bai_giang (trang_thai);

-- 4. Create table: tu_vung (Vocabulary with Syllables Breakdown & Primary Stress)
CREATE TABLE IF NOT EXISTS tu_vung (
    id SERIAL PRIMARY KEY,
    bai_giang_id INTEGER NOT NULL REFERENCES bai_giang (id) ON DELETE CASCADE,
    tu_tieng_anh VARCHAR(120) NOT NULL,
    nghia_tieng_viet VARCHAR(255) NOT NULL,
    tu_loai VARCHAR(30) DEFAULT 'noun' NOT NULL,
    phien_am_ipa VARCHAR(120) NOT NULL,
    cac_am_tiet JSONB NOT NULL,
    vi_du_cau TEXT NOT NULL,
    dich_cau TEXT NOT NULL,
    hinh_anh_url TEXT,
    thu_tu_xuat_hien INTEGER DEFAULT 1 NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tu_vung_bai_giang_id ON tu_vung (bai_giang_id);
CREATE INDEX IF NOT EXISTS idx_tu_vung_tu_tieng_anh ON tu_vung (tu_tieng_anh);

-- 5. Create table: tro_choi (Penalty Shootout, Speed Racing, Gold Quest, Boss Battle)
CREATE TABLE IF NOT EXISTS tro_choi (
    id SERIAL PRIMARY KEY,
    bai_giang_id INTEGER NOT NULL REFERENCES bai_giang (id) ON DELETE CASCADE,
    loai_tro_choi VARCHAR(50) NOT NULL,
    tieu_de_game VARCHAR(150) NOT NULL,
    che_do_choi VARCHAR(30) DEFAULT 'TWO_TEAMS' NOT NULL,
    vi_tri_trong_slide INTEGER DEFAULT 2 NOT NULL,
    du_lieu_cau_hoi JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tro_choi_bai_giang_id ON tro_choi (bai_giang_id);
CREATE INDEX IF NOT EXISTS idx_tro_choi_loai_tro_choi ON tro_choi (loai_tro_choi);

-- 6. Create table: bai_tap (Interactive Exercises)
CREATE TABLE IF NOT EXISTS bai_tap (
    id SERIAL PRIMARY KEY,
    bai_giang_id INTEGER NOT NULL REFERENCES bai_giang (id) ON DELETE CASCADE,
    dang_bai_tap VARCHAR(50) NOT NULL,
    cau_hoi TEXT NOT NULL,
    cac_lua_chon JSONB DEFAULT '[]'::jsonb NOT NULL,
    dap_an_dung TEXT NOT NULL,
    giai_thich_chi_tiet TEXT NOT NULL,
    thu_tu_slide INTEGER DEFAULT 3 NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bai_tap_bai_giang_id ON bai_tap (bai_giang_id);
CREATE INDEX IF NOT EXISTS idx_bai_tap_dang_bai_tap ON bai_tap (dang_bai_tap);

-- ==============================================================================
-- INITIAL SEED DATA
-- Default Teacher: teacher@school.edu.vn / Teacher@2026
-- Sample Lesson PIN: ENG-8492
-- ==============================================================================

-- Seed Teacher (Password: Teacher@2026 hashed with bcrypt)
INSERT INTO nguoi_dung (id, email, mat_khau_hash, ho_ten, vai_tro, trang_thai)
VALUES (
    1,
    'teacher@school.edu.vn',
    '$2b$10$w3U6W5o2YJ95B.mG09P5y.dklYV9mB96tE4hB8u1e7r1yV4qC2l2O',
    'Thầy Nguyễn Văn An',
    'TEACHER',
    1
)
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Lesson
INSERT INTO bai_giang (id, nguoi_dung_id, ma_bai_giang, tieu_de, khoi_lop, chu_de, thoi_luong_phut, cau_hinh_trinh_chieu, trang_thai)
VALUES (
    1,
    1,
    'ENG-8492',
    'Unit 4: My Neighbourhood - Places & Adjectives',
    6,
    'My Neighbourhood',
    45,
    '{"theme": "CLEAN_ACADEMIC", "fontScale": "PRESENTATION_BOARD", "soundEnabled": true}'::jsonb,
    1
)
ON CONFLICT (ma_bai_giang) DO NOTHING;

-- Seed Vocabularies with Syllables and Primary Stress (zero TTS)
INSERT INTO tu_vung (bai_giang_id, tu_tieng_anh, nghia_tieng_viet, tu_loai, phien_am_ipa, cac_am_tiet, vi_du_cau, dich_cau, thuTuXuatHien)
SELECT 
    1,
    'neighbourhood',
    'Khu phố, xóm giềng',
    'noun',
    '/ˈneɪ.bə.hʊd/',
    '[{"text": "neigh", "isStress": true}, {"text": "bour", "isStress": false}, {"text": "hood", "isStress": false}]'::jsonb,
    'There are many friendly people living in my neighbourhood.',
    'Có rất nhiều người thân thiện sống trong khu phố của tôi.',
    1
WHERE NOT EXISTS (SELECT 1 FROM tu_vung WHERE bai_giang_id = 1 AND tu_tieng_anh = 'neighbourhood');

INSERT INTO tu_vung (bai_giang_id, tu_tieng_anh, nghia_tieng_viet, tu_loai, phien_am_ipa, cac_am_tiet, vi_du_cau, dich_cau, thuTuXuatHien)
SELECT 
    1,
    'convenient',
    'Thuận tiện, tiện nghi',
    'adjective',
    '/kənˈviː.ni.ənt/',
    '[{"text": "con", "isStress": false}, {"text": "ve", "isStress": true}, {"text": "ni", "isStress": false}, {"text": "ent", "isStress": false}]'::jsonb,
    'The modern supermarket is very convenient for buying groceries.',
    'Siêu thị hiện đại rất thuận tiện để mua đồ tạp hóa.',
    2
WHERE NOT EXISTS (SELECT 1 FROM tu_vung WHERE bai_giang_id = 1 AND tu_tieng_anh = 'convenient');

INSERT INTO tu_vung (bai_giang_id, tu_tieng_anh, nghia_tieng_viet, tu_loai, phien_am_ipa, cac_am_tiet, vi_du_cau, dich_cau, thuTuXuatHien)
SELECT 
    1,
    'historic',
    'Mang tính lịch sử, cổ kính',
    'adjective',
    '/hɪˈstɒr.ɪk/',
    '[{"text": "his", "isStress": false}, {"text": "tor", "isStress": true}, {"text": "ic", "isStress": false}]'::jsonb,
    'Hoi An is a famous historic town with preserved architecture.',
    'Hội An là một đô thị cổ kính nổi tiếng với kiến trúc được bảo tồn.',
    3
WHERE NOT EXISTS (SELECT 1 FROM tu_vung WHERE bai_giang_id = 1 AND tu_tieng_anh = 'historic');

INSERT INTO tu_vung (bai_giang_id, tu_tieng_anh, nghia_tieng_viet, tu_loai, phien_am_ipa, cac_am_tiet, vi_du_cau, dich_cau, thuTuXuatHien)
SELECT 
    1,
    'fantastic',
    'Tuyệt vời, kỳ diệu',
    'adjective',
    '/fænˈtæs.tɪk/',
    '[{"text": "fan", "isStress": false}, {"text": "tas", "isStress": true}, {"text": "tic", "isStress": false}]'::jsonb,
    'The atmosphere at the school football match was fantastic.',
    'Bầu không khí trong trận đấu bóng đá của trường thật tuyệt vời.',
    4
WHERE NOT EXISTS (SELECT 1 FROM tu_vung WHERE bai_giang_id = 1 AND tu_tieng_anh = 'fantastic');

INSERT INTO tu_vung (bai_giang_id, tu_tieng_anh, nghia_tieng_viet, tu_loai, phien_am_ipa, cac_am_tiet, vi_du_cau, dich_cau, thuTuXuatHien)
SELECT 
    1,
    'multiple',
    'Nhiều, đa dạng',
    'adjective',
    '/ˈmʌl.tɪ.pəl/',
    '[{"text": "mul", "isStress": true}, {"text": "ti", "isStress": false}, {"text": "ple", "isStress": false}]'::jsonb,
    'Our striker had multiple chances to score penalty goals.',
    'Tiền đạo của chúng tôi đã có nhiều cơ hội ghi bàn sút phạt đền.',
    5
WHERE NOT EXISTS (SELECT 1 FROM tu_vung WHERE bai_giang_id = 1 AND tu_tieng_anh = 'multiple');

-- Seed Exercises
INSERT INTO bai_tap (bai_giang_id, dang_bai_tap, cau_hoi, cac_lua_chon, dap_an_dung, giai_thich_chi_tiet, thu_tu_slide)
SELECT
    1,
    'MULTIPLE_CHOICE',
    'Living in this suburb is very _______ because the bus stop is right in front of the house.',
    '["convenient", "boring", "noisy", "crowded"]'::jsonb,
    'convenient',
    'Tính từ "convenient" (thuận tiện) phù hợp với ngữ cảnh trạm xe buýt ở ngay trước nhà.',
    1
WHERE NOT EXISTS (SELECT 1 FROM bai_tap WHERE bai_giang_id = 1 AND dap_an_dung = 'convenient');

INSERT INTO bai_tap (bai_giang_id, dang_bai_tap, cau_hoi, cac_lua_chon, dap_an_dung, giai_thich_chi_tiet, thu_tu_slide)
SELECT
    1,
    'FILL_BLANK',
    'The ancient pagoda is one of the most famous _______ buildings in the province.',
    '[]'::jsonb,
    'historic',
    'Điền từ "historic" (mang tính lịch sử) để miêu tả ngôi chùa cổ.',
    2
WHERE NOT EXISTS (SELECT 1 FROM bai_tap WHERE bai_giang_id = 1 AND dap_an_dung = 'historic');

INSERT INTO bai_tap (bai_giang_id, dang_bai_tap, cau_hoi, cac_lua_chon, dap_an_dung, giai_thich_chi_tiet, thu_tu_slide)
SELECT
    1,
    'SENTENCE_SCRAMBLE',
    'people / very / in / friendly / my / are / neighbourhood / .',
    '["People", "in", "my", "neighbourhood", "are", "very", "friendly."]'::jsonb,
    'People in my neighbourhood are very friendly.',
    'Cấu trúc câu khẳng định chuẩn: People in my neighbourhood (Chủ ngữ) + are (to be) + very friendly (Vị ngữ).',
    3
WHERE NOT EXISTS (SELECT 1 FROM bai_tap WHERE bai_giang_id = 1 AND dap_an_dung = 'People in my neighbourhood are very friendly.');

-- Seed Games (Penalty Shootout & Speed Racing)
INSERT INTO tro_choi (bai_giang_id, loai_tro_choi, tieu_de_game, che_do_choi, vi_tri_trong_slide, du_lieu_cau_hoi)
SELECT
    1,
    'PENALTY_SHOOTOUT',
    'Sút bóng Penalty: Chinh phục khung thành',
    'TWO_TEAMS',
    2,
    '[
        {"id": 1, "question": "Living here is _______ (convenient / noisy)?", "options": ["convenient", "boring", "noisy", "crowded"], "answer": "convenient"},
        {"id": 2, "question": "Hoi An is a _______ town.", "options": ["historic", "modern", "polluted", "ugly"], "answer": "historic"},
        {"id": 3, "question": "The atmosphere was _______!", "options": ["fantastic", "terrible", "bad", "sad"], "answer": "fantastic"}
    ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tro_choi WHERE bai_giang_id = 1 AND loai_tro_choi = 'PENALTY_SHOOTOUT');

INSERT INTO tro_choi (bai_giang_id, loai_tro_choi, tieu_de_game, che_do_choi, vi_tri_trong_slide, du_lieu_cau_hoi)
SELECT
    1,
    'SPEED_RACING',
    'Đua xe Turbo: Bứt tốc Nitro',
    'TWO_TEAMS',
    3,
    '[
        {"id": 1, "question": "Living here is _______?", "options": ["convenient", "boring", "noisy", "crowded"], "answer": "convenient"},
        {"id": 2, "question": "Hoi An is a _______ town.", "options": ["historic", "modern", "polluted", "ugly"], "answer": "historic"}
    ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tro_choi WHERE bai_giang_id = 1 AND loai_tro_choi = 'SPEED_RACING');

-- Update serial sequence values
SELECT setval('nguoi_dung_id_seq', (SELECT COALESCE(MAX(id), 1) FROM nguoi_dung));
SELECT setval('bai_giang_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bai_giang));
SELECT setval('tu_vung_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tu_vung));
SELECT setval('tro_choi_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tro_choi));
SELECT setval('bai_tap_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bai_tap));
