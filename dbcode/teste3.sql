INSERT INTO knowledge_base (
  id, question, answer, category, is_active, created_at, updated_at
) VALUES
-- ID 12
(12,
 'Quanto custa o acesso ao curso CryptoTrading?',
 'O curso completo CryptoTrading custa €600 à vista ou pode ser parcelado em 3x €200 via Klarna. O acesso é vitalício.',
 'product', true, NOW(), NOW()),

-- ID 13
(13,
 'Que tipos de planos existem para o Grupo VIP?',
 'Há diversos planos: 1 mês por €100/mês; 3 meses por €200 (≈€66/mês); 6 meses por €350 (≈€58/mês); ou 1 ano por €430 (≈€35/mês), sendo esse último o melhor custo-benefício.',
 'product', true, NOW(), NOW()),

-- ID 14
(14,
 'O que está incluído no acesso VIP mensal?',
 'Inclui sinais exclusivos de day trade, swing trade e scalp, todos com zona de entrada, alvos e stop loss, acompanhados de prints dos gráficos, mais 10 % de desconto como afiliado da BingX/Bitget.',
 'product', true, NOW(), NOW()),

-- ID 15
(15,
 'O que é o plano VIP + Investimentos?',
 'Esse plano combina sinais VIP de trading com uma carteira de investimentos de longo prazo, análise de projetos promissores e também oferece 10 % de desconto como afiliado da BingX/Bitget.',
 'product', true, NOW(), NOW()),

-- ID 16
(16,
 'Quanto custa o plano VIP + Investimentos?',
 'Os valores são: 1 mês por €150; 3 meses por €290 (≈€97/mês); 6 meses por €400 (≈€67/mês); ou 1 ano por €500 (≈€42/mês), sendo o anual o melhor valor.',
 'product', true, NOW(), NOW()),

-- ID 17
(17,
 'O que é a CryptoAcademia?',
 'É o curso completo de trading, do nível básico ao avançado, com plataforma de criptomoedas — acesso vitalício incluído.',
 'product', true, NOW(), NOW()),

-- ID 18
(18,
 'Quais são os módulos do curso CryptoTrading?',
 'São 12 módulos: — Módulo 1: O Básico das Criptomoedas; 2: Trading com Elliot e Wyckoff; 3: Trade de Sucesso; 4: Erros dos Outros; 5: Correlação Macro; 6: Análise Técnica/Medição de Sentimento; 7: Estratégia Day Trade e Scalp; 8: Swing Trade; 9: Trading Avançado; 10: Mercado de Futuros; 11: O Que Nenhum Trader Te Ensina; 12: Atualizações.',
 'general', true, NOW(), NOW()),

-- ID 19
(19,
 'O acesso ao curso é por tempo limitado?',
 'Não. Ao adquirir o CryptoTrading, você tem acesso vitalício aos conteúdos, inclusive atualizações futuras.',
 'general', true, NOW(), NOW()),

-- ID 20
(20,
 'O que faz a CryptoComunidade?',
 'São duas comunidades no Telegram: uma focada em trading (sinais e análises diárias) e outra para investimentos a longo prazo, ambas com suporte 24/7.',
 'general', true, NOW(), NOW());
