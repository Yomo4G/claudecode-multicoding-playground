# Design Principles

This rule defines core software design principles
that govern both code generation and code review.

## Applicability

This rule applies to the following agents:
implementer, reviewer, refactorer

## Principles

### DRY — Don't Repeat Yourself

#### Definition

同じ知識・ロジック・判断をシステム内の複数箇所に重複させない。
変更が必要になった時に一箇所だけ修正すれば済む状態を維持する。

#### Generation Guidelines（実装時）

- 共通ロジックはユーティリティ関数やカスタムフックとして抽出する
- 定数・設定値は一箇所で定義し、インポートして使う
- 同じバリデーションロジックを複数箇所に書かない
- API レスポンスの型定義は一箇所で管理し、
  フロントエンドとバックエンドで共有する
- 類似コンポーネントが 3 つ以上になった場合は
  共通コンポーネントへの抽出を検討する

#### Review Checklist（レビュー時）

- [ ] コンポーネント間で重複するロジックがないか
- [ ] 共通処理が適切に抽出されているか
- [ ] 定数・設定値が一箇所で管理されているか
- [ ] 同一のバリデーションルールが複数箇所に存在しないか
- [ ] 型定義が不必要に重複していないか

### KISS — Keep It Simple, Stupid

#### Definition

最も単純な実装を選択する。
不要な複雑さを導入しない。
将来の仮想的な要件のために設計しない。

#### Generation Guidelines（実装時）

- 現在の要件を満たす最小限のコードを書く
- 不要な抽象化レイヤーを導入しない
- 条件分岐はフラットに保ち、深いネストを避ける
- 一つの関数は一画面に収まる長さを目安とする
- 「念のため」のコードやフラグを追加しない

#### Review Checklist（レビュー時）

- [ ] 不要な抽象化やラッパーが存在しないか
- [ ] 制御フローが直感的に理解できるか
- [ ] 過度に汎用的な設計になっていないか
- [ ] 現在使われていないパラメータや分岐がないか
- [ ] より単純な実装で同じ目的を達成できないか

### SRP — Single Responsibility Principle

#### Definition

各モジュール・クラス・関数は一つの責務のみを持つ。
変更の理由が一つだけであるべき。

#### Generation Guidelines（実装時）

- コンポーネントは表示に関する責務のみを持つ
- ビジネスロジックはカスタムフックやサービス層に分離する
- 一つの関数が複数の処理を行っている場合は分割する
- API ルートは一つのリソース操作に対応させる
- データベースアクセスは専用のリポジトリ層に集約する

#### Review Checklist（レビュー時）

- [ ] 一つのコンポーネントが複数の責務を持っていないか
- [ ] 関数が一つのことだけを行っているか
- [ ] ファイルの変更理由が一つに絞られているか
- [ ] God object や mega-component が存在しないか
- [ ] データ取得とレンダリングが適切に分離されているか

### SoC — Separation of Concerns

#### Definition

異なる関心事を明確に分離する。
各層・各モジュールは独立して理解・変更できるべき。

#### Generation Guidelines（実装時）

- UI ロジックとビジネスロジックを分離する
- データアクセス層とプレゼンテーション層を分離する
- スタイリングはフレームワークの推奨方法に従い、
  構造と分離する
- ルーティングとコンポーネントロジックを分離する
- エラーハンドリングは専用の境界
  （Error Boundary, middleware）で処理する

#### Review Checklist（レビュー時）

- [ ] UI 層にビジネスロジックが混入していないか
- [ ] データアクセスがコンポーネントに直接書かれていないか
- [ ] スタイルが構造と適切に分離されているか
- [ ] 異なる関心事が同一ファイルに混在していないか
- [ ] 各層が独立してテスト可能か

## Implementer Obligations

コード生成時にすべての Generation Guidelines を適用する。
原則に反するコードを書いた場合、提出前にリファクタリングする。

各原則は独立した判断基準であり、すべてを同時に満たすこと。
原則間でトレードオフが生じる場合は、
現在のタスクの文脈で最も重要な原則を優先し、
その判断理由を result file に記録する。

## Reviewer Obligations

すべての Review Checklist を検証する。
違反を発見した場合、原則名（DRY, KISS, SRP, SoC）を
引用して報告する。

報告形式:
- Principle: {DRY | KISS | SRP | SoC}
- Location: {file}:{line}
- Description: 問題の説明
- Recommendation: 修正方針
