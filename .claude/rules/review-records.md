---
paths:
  - ".claude/state/review-records/**"
  - ".claude/state/agent-results/**"
---

# Review Records

This rule governs the structured recording of code reviews
in markdown format for traceability by both AI and humans.

## Purpose

コードレビューの指摘・修正対応を構造化された markdown で記録し、
AI と人間の両方が追跡可能にする。

JSON result file はエージェント間の通信用であり、
レビュー記録 md は長期的な追跡・分析用である。
両者は補完関係にあり、置き換えではない。

## Applicability

This rule applies to the following agents:
reviewer, security-auditor, implementer

## Precondition

レビュー記録は `.claude/state/review-records/` に格納する。
ディレクトリが存在しない場合、reviewer が最初のレビュー時に作成する。

## Record Location

`.claude/state/review-records/{task-id}-review.md`

一つのタスクにつき一つのレビュー記録ファイルを作成する。
差し戻しによる再レビュー時は同一ファイルを更新する。

## Record Format

レビュー記録は YAML frontmatter と Markdown body で構成する。

```markdown
---
task_id: "{task-id}"
recorder: "{review-recorder instance}"
reviewed_at: "{ISO 8601}"
status: open | resolved | closed
finding_count: {number}
revision: {number}
perspectives:
  - design-principles
  - coding-standards
  - owasp-top10
---

## Summary

レビュー対象の概要（何を実装したタスクか）

## Perspectives Applied

### Design Principles

| Principle | Result |
|-----------|--------|
| DRY       | pass / fail ({N} findings) |
| KISS      | pass / fail ({N} findings) |
| SRP       | pass / fail ({N} findings) |
| SoC       | pass / fail ({N} findings) |

### Coding Standards

| Category | Items Checked | Result |
|----------|--------------|--------|
| Company (C1–C28) | {N} applicable | pass / fail ({N} findings) |
| Team (T1–T14)    | {N} applicable | pass / fail ({N} findings) |

### OWASP Top 10

| ID  | Category | Result |
|-----|----------|--------|
| A01 | Broken Access Control | pass / n/a / fail ({N} findings) |
| A02 | Cryptographic Failures | pass / n/a / fail ({N} findings) |
| A03 | Injection | pass / n/a / fail ({N} findings) |
| A04 | Insecure Design | pass / n/a / fail ({N} findings) |
| A05 | Security Misconfiguration | pass / n/a / fail ({N} findings) |
| A06 | Vulnerable Components | pass / n/a / fail ({N} findings) |
| A07 | Auth Failures | pass / n/a / fail ({N} findings) |
| A08 | Integrity Failures | pass / n/a / fail ({N} findings) |
| A09 | Logging Failures | pass / n/a / fail ({N} findings) |
| A10 | SSRF | pass / n/a / fail ({N} findings) |

## Findings

### F1

- **Location**: {file}:{line}
- **Severity**: critical | high | medium | low
- **Category**: design-principle | coding-standard | owasp | architecture
- **Reference**: {DRY | KISS | SRP | SoC | C1 | T3 | A03 等}
- **Description**: 問題の説明
- **Recommendation**: 修正方針
- **Resolution**: pending | fixed | wontfix
- **Fix commit**: {hash, 修正後に追記}

### F2

...

## Fix Actions

（implementer が修正後に記入）

- F1: {修正内容の説明}
- F2: {修正内容の説明}

## Resolution

- All findings resolved: yes | no
- Final status: resolved | escalated
- Closed at: {ISO 8601}
```

## Field Definitions

### Frontmatter

| Field | Description |
|-------|-------------|
| task_id | 対象タスクの ID |
| recorder | レビュー記録を作成した review-recorder インスタンス名 |
| reviewed_at | 最初のレビュー実施日時 |
| status | open: 未解決の指摘あり, resolved: 全指摘対応済み, closed: 最終確認完了 |
| finding_count | 指摘の総数 |
| revision | レビュー回数（差し戻し時にインクリメント） |
| perspectives | 適用された観点のリスト（design-principles, coding-standards, owasp-top10） |

### Perspectives Applied Fields

| Field | Description |
|-------|-------------|
| Principle / Category / ID | 検証対象の観点 |
| Items Checked | 検証した項目数（Coding Standards のみ） |
| Result | pass: 問題なし, fail ({N} findings): 指摘あり, n/a: 対象外 |

### Finding Fields

| Field | Description |
|-------|-------------|
| Location | 問題のあるファイルと行番号 |
| Severity | critical: 必ず修正, high: 修正推奨, medium: 改善推奨, low: 提案 |
| Category | 違反カテゴリ（設計原則、コーディング規約、OWASP、アーキテクチャ） |
| Reference | 具体的なルール参照（原則名、規約番号、OWASP ID） |
| Description | 問題の説明 |
| Recommendation | 推奨する修正方針 |
| Resolution | pending: 未対応, fixed: 修正済み, wontfix: 対応しない（理由必須） |
| Fix commit | 修正を含むコミットハッシュ |

## Reviewer Obligations

- agent-results に詳細なレビュー結果を書く
- result file に perspectives_applied フィールドを含め、
  各チェックリスト（DRY, KISS, SRP, SoC, Company Standards, Team Standards）
  の pass/fail を記録する
- Finding には必ず Category と Reference を含め、
  どのルールに基づく指摘かを明確にする
- レビュー記録 md への直接書き込みは行わない
  （review-recorder が統合記録を作成する）

## Security-Auditor Obligations

- agent-results に詳細な監査結果を書く
- result file に owasp_perspectives フィールドを含め、
  OWASP Top 10 の全カテゴリ（A01〜A10）の
  pass/fail/n-a を記録する
- Finding の Category は `owasp` を使用し、
  Reference には OWASP ID を記載する
- レビュー記録 md への直接書き込みは行わない
  （review-recorder が統合記録を作成する）

## Review-Recorder Obligations

- reviewer と security-auditor の両方の result file を読み取る
- 統合されたレビュー記録 md を
  `.claude/state/review-records/{task-id}-review.md` に作成する
- Perspectives Applied セクションを必ず記入し、
  検証した全チェックリストの結果を記録する
- 指摘がないカテゴリでも pass として記録し、検証範囲を明示する
- 差し戻し後の再レビュー時は revision をインクリメントし、
  新たな findings を追記する
- 全 findings が解決されたら status を closed に更新する
- レビュー記録 md の唯一の作成者である
  （implementer による Fix Actions 更新を除く）

## Implementer Obligations

- レビュー指摘を受けた後、該当レビュー記録の
  Fix Actions セクションに修正内容を記入する
- 各 Finding の Resolution を fixed または wontfix に更新する
- wontfix の場合は Fix Actions に理由を記載する
- Fix commit に修正コミットのハッシュを記入する

## Orchestrator Integration

レビュー記録のライフサイクルは以下の通り:

1. reviewer と security-auditor が並行でレビューし、
   それぞれ agent-results に結果を書く
2. review-recorder が両者の結果を読み取り、
   統合レビュー記録 md を作成（status: open）
3. 指摘がある場合、orchestrator がタスクを implementer に差し戻す
4. implementer が修正し、Fix Actions を記入
5. orchestrator が再度 reviewer に割り当てる
6. reviewer が再レビューし、result file を更新
7. review-recorder が記録を更新（revision インクリメント）
8. 全指摘が解決されたら review-recorder が status を closed に更新
9. 指摘がない場合、review-recorder は status: closed で記録を作成
