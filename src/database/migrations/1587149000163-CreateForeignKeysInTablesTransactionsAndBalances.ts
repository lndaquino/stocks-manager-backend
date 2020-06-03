import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateForeignKeysInTablesTransactionsAndBalances1587149000163
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionAsset',
        columnNames: ['asset_id'],
        referencedTableName: 'assets',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'balances',
      new TableForeignKey({
        name: 'BalanceUser',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'balances',
      new TableForeignKey({
        name: 'BalanceAsset',
        columnNames: ['asset_id'],
        referencedTableName: 'assets',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('balances', 'BalanceAsset');
    await queryRunner.dropForeignKey('balances', 'BalanceUser');
    await queryRunner.dropForeignKey('transactions', 'TransactionAsset');
    await queryRunner.dropForeignKey('transactions', 'TransactionUser');
  }
}
