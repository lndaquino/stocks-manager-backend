import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactionsTable1587148904747
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
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
            name: 'closed_id',
            type: 'uuid',
            default: null,
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
          },
          {
            name: 'quantity',
            type: 'float',
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'cost',
            type: 'float',
          },
          {
            name: 'total_value',
            type: 'float',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
