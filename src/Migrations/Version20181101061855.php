<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181101061855 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE endorsement (id INT AUTO_INCREMENT NOT NULL, sender_id INT DEFAULT NULL, reciever_id INT DEFAULT NULL, date DATETIME NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_1BB4EA3F624B39D (sender_id), INDEX IDX_1BB4EA35D5C928D (reciever_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE endorsement ADD CONSTRAINT FK_1BB4EA3F624B39D FOREIGN KEY (sender_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE endorsement ADD CONSTRAINT FK_1BB4EA35D5C928D FOREIGN KEY (reciever_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE endorsement');
    }
}
