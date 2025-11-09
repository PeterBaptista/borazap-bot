INSERT INTO knowledge_base_tags (_order, _parent_id, id, tag)
VALUES
-- 1. Quem é a Cryptogirl?
(0, '1', 'tag-1a', 'cryptogirl'),
(1, '1', 'tag-1b', 'sobre'),

-- 2. O que a Cryptogirl oferece?
(0, '2', 'tag-2a', 'plataforma'),
(1, '2', 'tag-2b', 'curso'),

-- 3. Quais são os grupos no Telegram da Cryptogirl?
(0, '3', 'tag-3a', 'telegram'),
(1, '3', 'tag-3b', 'grupos'),

-- 4. Qual a diferença entre os grupos?
(0, '4', 'tag-4a', 'grupo-vip'),
(1, '4', 'tag-4b', 'grupo-aberto'),

-- 5. Quando o grupo CryptoGemas está aberto?
(0, '5', 'tag-5a', 'cryptogemas'),
(1, '5', 'tag-5b', 'alt-season'),

-- 6. Como acessar o Grupo VIP?
(0, '6', 'tag-6a', 'grupo-vip'),
(1, '6', 'tag-6b', 'restrito'),

-- 7. O que é o Grupo Aberto?
(0, '7', 'tag-7a', 'grupo-aberto'),
(1, '7', 'tag-7b', 'gratuito'),

-- 8. Quais conteúdos estão no curso?
(0, '8', 'tag-8a', 'curso'),
(1, '8', 'tag-8b', 'conteúdo'),

-- 9. O curso oferece recomendações de trade?
(0, '9', 'tag-9a', 'recomendações'),
(1, '9', 'tag-9b', 'educação'),

-- 10. O que aprender no curso durante a Alt Season?
(0, '10', 'tag-10a', 'alt-season'),
(1, '10', 'tag-10b', 'sinais');
