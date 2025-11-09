-- Inserts para knowledge_base
INSERT INTO knowledge_base (id, question, answer, category, "is_active", created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Quem é a Cryptogirl?', 'A CryptoGirl é uma plataforma focada em educação e comunidade sobre criptomoedas.', 'general', true, now(), now()),
('22222222-2222-2222-2222-222222222222', 'O que a Cryptogirl oferece?', 'Oferece cursos, grupos no Telegram e conteúdos educativos sobre criptomoedas.', 'general', true, now(), now()),
('33333333-3333-3333-3333-333333333333', 'Quais são os grupos no Telegram da Cryptogirl?', 'Há o Grupo VIP para membros e o Grupo Aberto gratuito.', 'general', true, now(), now()),
('44444444-4444-4444-4444-444444444444', 'Qual a diferença entre os grupos?', 'O Grupo VIP é restrito com conteúdo exclusivo, o Aberto é gratuito e acessível a todos.', 'general', true, now(), now()),
('55555555-5555-5555-5555-555555555555', 'Quando o grupo CryptoGemas está aberto?', 'O grupo CryptoGemas abre durante as Alt Seasons para discussões e sinais.', 'general', true, now(), now()),
('66666666-6666-6666-6666-666666666666', 'Como acessar o Grupo VIP?', 'O acesso é restrito para membros cadastrados e que completaram o curso.', 'general', true, now(), now()),
('77777777-7777-7777-7777-777777777777', 'O que é o Grupo Aberto?', 'É um grupo gratuito para quem quer aprender sobre criptomoedas sem restrições.', 'general', true, now(), now()),
('88888888-8888-8888-8888-888888888888', 'Quais conteúdos estão no curso?', 'O curso inclui estratégias de trade, educação sobre cripto e análise de mercado.', 'general', true, now(), now()),
('99999999-9999-9999-9999-999999999999', 'O curso oferece recomendações de trade?', 'Não, o foco é educacional, mas fornece sinais e estudos de caso.', 'general', true, now(), now()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'O que aprender no curso durante a Alt Season?', 'Aprender estratégias específicas para Alt Season, análise de sinais e gestão de risco.', 'general', true, now(), now());

-- Inserts para knowledge_base_tags
INSERT INTO knowledge_base_tags ("_parent_id", id, "_order", tag) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-aaaaaaaa1111', 0, 'cryptogirl'),
('11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-aaaaaaaa1112', 1, 'sobre'),

('22222222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-bbbbbbbb2221', 0, 'plataforma'),
('22222222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-bbbbbbbb2222', 1, 'curso'),

('33333333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-cccccccc3331', 0, 'telegram'),
('33333333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-cccccccc3332', 1, 'grupos'),

('44444444-4444-4444-4444-444444444444', 'dddd4444-4444-4444-4444-dddddddd4441', 0, 'grupo-vip'),
('44444444-4444-4444-4444-444444444444', 'dddd4444-4444-4444-4444-dddddddd4442', 1, 'grupo-aberto'),

('55555555-5555-5555-5555-555555555555', 'eeee5555-5555-5555-5555-eeeeeeee5551', 0, 'cryptogemas'),
('55555555-5555-5555-5555-555555555555', 'eeee5555-5555-5555-5555-eeeeeeee5552', 1, 'alt-season'),

('66666666-6666-6666-6666-666666666666', 'ffff6666-6666-6666-6666-ffffffff6661', 0, 'grupo-vip'),
('66666666-6666-6666-6666-666666666666', 'ffff6666-6666-6666-6666-ffffffff6662', 1, 'restrito'),

('77777777-7777-7777-7777-777777777777', 'gggg7777-7777-7777-7777-gggggggg7771', 0, 'grupo-aberto'),
('77777777-7777-7777-7777-777777777777', 'gggg7777-7777-7777-7777-gggggggg7772', 1, 'gratuito'),

('88888888-8888-8888-8888-888888888888', 'hhhh8888-8888-8888-8888-hhhhhhhh8881', 0, 'curso'),
('88888888-8888-8888-8888-888888888888', 'hhhh8888-8888-8888-8888-hhhhhhhh8882', 1, 'conteúdo'),

('99999999-9999-9999-9999-999999999999', 'iiii9999-9999-9999-9999-iiiiiiii9991', 0, 'recomendações'),
('99999999-9999-9999-9999-999999999999', 'iiii9999-9999-9999-9999-iiiiiiii9992', 1, 'educação'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'jjjjaaaa-aaaa-aaaa-aaaa-jjjjjjjjaaaa1', 0, 'alt-season'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'jjjjaaaa-aaaa-aaaa-aaaa-jjjjjjjjaaaa2', 1, 'sinais');
