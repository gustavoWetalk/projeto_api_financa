-- CreateTable
CREATE TABLE `investmentproduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_produto` VARCHAR(50) NOT NULL,
    `nome_produto` VARCHAR(200) NOT NULL,
    `tipo_produto` VARCHAR(20) NOT NULL,
    `descricao` TEXT NULL,
    `moeda` CHAR(3) NOT NULL DEFAULT 'BRL',
    `taxa_administracao` DECIMAL(5, 2) NULL,

    UNIQUE INDEX `codigo_produto`(`codigo_produto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investmentreturn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_investment_id` INTEGER NOT NULL,
    `data_referencia` DATE NOT NULL,
    `valor_fechamento` DECIMAL(20, 2) NOT NULL,
    `rentabilidade_periodo` DECIMAL(10, 4) NULL,
    `custo_total_periodo` DECIMAL(20, 2) NULL,

    INDEX `user_investment_id`(`user_investment_id`),
    UNIQUE INDEX `investmentreturn_user_investment_id_data_referencia_key`(`user_investment_id`, `data_referencia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nome_carteira` VARCHAR(100) NOT NULL,
    `data_criacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `ses_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ses_key` VARCHAR(40) NULL,
    `ses_ip` VARCHAR(20) NULL,
    `ses_location` VARCHAR(40) NULL,
    `ses_city` VARCHAR(100) NULL,
    `ses_state` VARCHAR(100) NULL,
    `ses_country` VARCHAR(20) NULL,
    `ses_timezone` VARCHAR(100) NULL,
    `ses_status` INTEGER NOT NULL DEFAULT 1,
    `ses_company` INTEGER NULL,
    `ses_created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ses_expiration_date` DATETIME(0) NULL,
    `ses_client` INTEGER NOT NULL DEFAULT 1,
    `ses_user` INTEGER NOT NULL,

    INDEX `ses_user`(`ses_user`),
    PRIMARY KEY (`ses_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_investment_id` INTEGER NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    `data_transacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `quantidade` DECIMAL(20, 8) NOT NULL,
    `valor_unitario` DECIMAL(20, 8) NOT NULL,
    `valor_total` DECIMAL(20, 2) NOT NULL,
    `taxas` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `observacoes` TEXT NULL,

    INDEX `user_investment_id`(`user_investment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `date_of_birth` DATE NULL,
    `data_criacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ultimo_login` DATETIME(0) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userinvestment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `portfolio_id` INTEGER NOT NULL,
    `investment_product_id` INTEGER NOT NULL,
    `data_inicio` DATE NOT NULL,
    `quantidade` DECIMAL(20, 8) NOT NULL,
    `custo_total` DECIMAL(20, 2) NOT NULL,
    `valor_unitario_medio` DECIMAL(20, 8) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `data_ultima_atualizacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `investment_product_id`(`investment_product_id`),
    INDEX `portfolio_id`(`portfolio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userprofile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `idade` INTEGER NULL,
    `profissao` VARCHAR(100) NULL,
    `perfil_risco` VARCHAR(20) NOT NULL,
    `objetivo_primario` VARCHAR(100) NULL,
    `renda_mensal` DECIMAL(15, 2) NULL,
    `patrimonio_atual` DECIMAL(20, 2) NULL,
    `data_atualizacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `investmentreturn` ADD CONSTRAINT `investmentreturn_ibfk_1` FOREIGN KEY (`user_investment_id`) REFERENCES `userinvestment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `portfolio` ADD CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`ses_user`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`user_investment_id`) REFERENCES `userinvestment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userinvestment` ADD CONSTRAINT `userinvestment_ibfk_1` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userinvestment` ADD CONSTRAINT `userinvestment_ibfk_2` FOREIGN KEY (`investment_product_id`) REFERENCES `investmentproduct`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userprofile` ADD CONSTRAINT `userprofile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
