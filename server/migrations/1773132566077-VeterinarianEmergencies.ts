import { MigrationInterface, QueryRunner } from "typeorm";

export class VeterinarianEmergencies1773132566077 implements MigrationInterface {
    name = 'VeterinarianEmergencies1773132566077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`veterinarian\` DROP COLUMN \`emergencies\``);
        await queryRunner.query(`ALTER TABLE \`veterinarian\` ADD \`emergencies\` tinyint NULL DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`veterinarian\` DROP COLUMN \`emergencies\``);
        await queryRunner.query(`ALTER TABLE \`veterinarian\` ADD \`emergencies\` varchar(255) NULL`);
    }

}
