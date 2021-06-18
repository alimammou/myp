<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181024092159 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE document ADD party_id INT DEFAULT NULL, ADD commity_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A76213C1059 FOREIGN KEY (party_id) REFERENCES party (id)');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A765791EA96 FOREIGN KEY (commity_id) REFERENCES commity (id)');
        $this->addSql('CREATE INDEX IDX_D8698A76213C1059 ON document (party_id)');
        $this->addSql('CREATE INDEX IDX_D8698A765791EA96 ON document (commity_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A76213C1059');
        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A765791EA96');
        $this->addSql('DROP INDEX IDX_D8698A76213C1059 ON document');
        $this->addSql('DROP INDEX IDX_D8698A765791EA96 ON document');
        $this->addSql('ALTER TABLE document DROP party_id, DROP commity_id');
    }
}
