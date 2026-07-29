import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1785363489846 implements MigrationInterface {
    name = 'CreateTables1785363489846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stat" ("id" SERIAL NOT NULL, "ipHash" character varying NOT NULL, "browser" character varying, "refererDomain" character varying, "clickedAt" TIMESTAMP NOT NULL DEFAULT now(), "linkId" integer NOT NULL, CONSTRAINT "PK_132de903d366f4c06cd586c43c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0633ac4e5e140bea11fa678a82" ON "stat" ("linkId") `);
        await queryRunner.query(`CREATE TABLE "link" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_677e4ae10dfc2c255daa2979e67" UNIQUE ("slug"), CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stat" ADD CONSTRAINT "FK_0633ac4e5e140bea11fa678a827" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stat" DROP CONSTRAINT "FK_0633ac4e5e140bea11fa678a827"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0633ac4e5e140bea11fa678a82"`);
        await queryRunner.query(`DROP TABLE "stat"`);
    }

}
