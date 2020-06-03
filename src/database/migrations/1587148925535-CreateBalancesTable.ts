import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBalancesTable1587148925535
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'balances',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'asset_id',
            type: 'uuid',
          },
          {
            name: 'total_quantity',
            type: 'float',
          },
          {
            name: 'total_value',
            type: 'float',
          },
          {
            name: 'total_invested',
            type: 'float',
          },
          {
            name: 'profit',
            type: 'float',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('balances');
  }
}
