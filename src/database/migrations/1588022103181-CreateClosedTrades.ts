import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateClosedTrades1588022103181
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'closedtrades',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'closedtrades',
      new TableForeignKey({
        name: 'ClosedTradesUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'closedtrades',
      new TableForeignKey({
        name: 'ClosedTradesAsset',
        columnNames: ['asset_id'],
        referencedTableName: 'assets',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('closedtrades', 'ClosedTradesAsset');
    await queryRunner.dropForeignKey('closedtrades', 'ClosedTradesUser');
    await queryRunner.dropTable('closedtrades');
  }
}
