import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableICAD1770635104494 implements MigrationInterface {
    name = 'NullableICAD1770635104494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`icad\` \`icad\` varchar(255) NULL DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`icad\` \`icad\` varchar(255) NOT NULL`);
    }

}
