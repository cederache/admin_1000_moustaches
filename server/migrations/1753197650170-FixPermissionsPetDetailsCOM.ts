import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPermissionsPetDetailsCOM1753197650170 implements MigrationInterface {
    name = 'FixPermissionsPetDetailsCOM1753197650170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE \`permission\` SET \`read\` = 0 WHERE \`teamId\` = 4 AND (\`ressourceId\` = 9 OR \`ressourceId\` = 10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE \`permission\` SET \`read\` = 1 WHERE \`teamId\` = 4 AND (\`ressourceId\` = 9 OR \`ressourceId\` = 10)`);
    }

}
