<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180927105551 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE commity (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE party (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user ADD party_id INT DEFAULT NULL, ADD commity_id INT DEFAULT NULL, CHANGE password password VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649213C1059 FOREIGN KEY (party_id) REFERENCES party (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6495791EA96 FOREIGN KEY (commity_id) REFERENCES commity (id)');
        $this->addSql('CREATE INDEX IDX_8D93D649213C1059 ON user (party_id)');
        $this->addSql('CREATE INDEX IDX_8D93D6495791EA96 ON user (commity_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6495791EA96');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649213C1059');
        $this->addSql('DROP TABLE commity');
        $this->addSql('DROP TABLE party');
        $this->addSql('DROP INDEX IDX_8D93D649213C1059 ON user');
        $this->addSql('DROP INDEX IDX_8D93D6495791EA96 ON user');
        $this->addSql('ALTER TABLE user DROP party_id, DROP commity_id, CHANGE password password VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci');
    }
}
