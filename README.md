### Users（ユーザー）テーブル

ユーザー情報を管理するテーブルです。

| カラム名       | データ型      | 制約                          | 説明                                    |
|----------------|---------------|-------------------------------|------------------------------------------|
| id             | UUID          | PRIMARY KEY                   | ユーザーのID                             |
| name           | VARCHAR(255)  | NOT NULL                      | ユーザー名                               |
| email          | VARCHAR(255)  | UNIQUE, NOT NULL              | メールアドレス                           |
| password_hash  | VARCHAR(255)  | NOT NULL                      | パスワードハッシュ                       |
| role           | ENUM          | NOT NULL                      | 役割 (admin, manager, office, field)     |
| created_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 作成日時                                 |
| updated_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 更新日時                                 |

### Items（アイテム）テーブル

在庫アイテムの情報を管理するテーブルです。

| カラム名           | データ型      | 制約                          | 説明                                    |
|--------------------|---------------|-------------------------------|------------------------------------------|
| id                 | UUID          | PRIMARY KEY                   | アイテムID                               |
| name               | VARCHAR(255)  | NOT NULL                      | アイテム名                               |
| description        | TEXT          |                               | アイテムの説明                           |
| category_id        | UUID          | FOREIGN KEY                   | カテゴリーID                             |
| shelf_number       | VARCHAR(50)   | UNIQUE, NOT NULL              | 棚番号                                   |
| current_quantity   | INT           | DEFAULT 0                     | 現在の在庫数                             |
| optimal_quantity   | INT           | DEFAULT 0                     | 適正在庫数                               |
| reorder_threshold  | INT           | DEFAULT 0                     | 発注基準数                               |
| unit               | VARCHAR(50)   | NOT NULL                      | 単位                                     |
| manufacturer       | VARCHAR(255)  |                               | メーカー名                               |
| supplier_info      | TEXT          |                               | 仕入先情報                               |
| price              | DECIMAL(10, 2)|                               | アイテム単価                             |
| created_at         | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 作成日時                                 |
| updated_at         | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 更新日時                                 |

### Categories（カテゴリ）テーブル

アイテムのカテゴリを管理するテーブルです。

| カラム名 | データ型      | 制約                          | 説明                                    |
|----------|---------------|-------------------------------|------------------------------------------|
| id       | UUID          | PRIMARY KEY                   | カテゴリーID                             |
| name     | VARCHAR(255)  | UNIQUE, NOT NULL              | カテゴリー名                             |

### Orders（発注）テーブル

発注情報を管理するテーブルです。

| カラム名               | データ型      | 制約                          | 説明                                    |
|------------------------|---------------|-------------------------------|------------------------------------------|
| id                     | UUID          | PRIMARY KEY                   | 発注ID                                   |
| item_id                | UUID          | FOREIGN KEY                   | 発注するアイテムのID                     |
| quantity               | INT           | NOT NULL                      | 発注数                                   |
| expected_delivery_date | DATE          |                               | 予定納期                                 |
| status                 | ENUM          | NOT NULL                      | ステータス (pending, approved, ordered, completed) |
| created_at             | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 作成日時                                 |
| updated_at             | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 更新日時                                 |

### InventoryTransactions（在庫取引）テーブル

在庫の入出庫を記録するテーブルです。

| カラム名         | データ型      | 制約                          | 説明                                    |
|------------------|---------------|-------------------------------|------------------------------------------|
| id               | UUID          | PRIMARY KEY                   | 取引ID                                   |
| item_id          | UUID          | FOREIGN KEY                   | 関連するアイテムのID                     |
| user_id          | UUID          | FOREIGN KEY                   | 取引を行ったユーザーのID                 |
| action           | ENUM          | NOT NULL                      | in (入庫), out (出庫)                    |
| quantity         | INT           | NOT NULL                      | 数量                                     |
| transaction_date | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 取引日時                                 |
| created_at       | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 作成日時                                 |
| updated_at       | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 更新日時                                 |

### AccessControls（アクセス制御）テーブル

ユーザーの役割ごとのアクセス権限を管理するテーブルです。

| カラム名 | データ型      | 制約                          | 説明                                    |
|----------|---------------|-------------------------------|------------------------------------------|
| id       | UUID          | PRIMARY KEY                   | アクセス制御ID                           |
| role     | ENUM          | NOT NULL                      | 役割 (admin, manager, office, field)     |
| page     | VARCHAR(255)  | NOT NULL                      | ページや機能名                           |
| rights   | SET           | NOT NULL                      | 権限 (read, write, delete)               |

### AuditLogs（監査ログ）テーブル

システム内の重要な操作を記録する監査ログテーブルです。

| カラム名   | データ型      | 制約                          | 説明                                    |
|------------|---------------|-------------------------------|------------------------------------------|
| id         | UUID          | PRIMARY KEY                   | ログID                                   |
| user_id    | UUID          | FOREIGN KEY                   | ユーザーID                               |
| action     | VARCHAR(255)  | NOT NULL                      | 実行した操作                             |
| details    | TEXT          |                               | 操作の詳細                               |
| timestamp  | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | 操作日時                                 |