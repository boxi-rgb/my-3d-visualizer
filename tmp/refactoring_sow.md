# リファクタリング作業範囲記述書 (SOW)

## 1. 目的

このリファクタリングの目的は、`my-3d-visualizer` アプリケーションのコンポーネント構造を改善し、保守性と可読性を向上させることです。具体的には、主要なReactコンポーネントを専用のディレクトリに分離します。

## 2. 範囲

このリファクタリング作業の範囲は以下の通りです。

- `src/App.tsx` ファイル内のコンポーネントの分割と移動。
- `src/main.tsx` ファイルのインポートパスの更新。

範囲外：

- 新機能の追加。
- UI/UXの変更。
- ビジネスロジックの変更。

## 3. 変更点

### 3.1. ファイル構造の変更

- **新規作成:**
    - `src/components/Scene.tsx`: `Scene` コンポーネントを含みます。
    - `src/components/App.tsx`: `App` コンポーネント（メインのCanvas設定）を含みます。
- **変更:**
    - `src/App.tsx`: 新しい `src/components/App.tsx` をエクスポートするように変更されます。
    - `src/main.tsx`: `App` コンポーネントのインポートパスが更新されます。

### 3.2. Diff

#### `src/App.tsx`

```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,26 +1,1 @@
-import { Canvas } from '@react-three/fiber'
-import { OrbitControls } from '@react-three/drei'
-
-function Scene() {
-  return (
-    <>
-      {/* ライト */}
-      <ambientLight intensity={1} />
-      <directionalLight position={[3, 3, 3]} intensity={3} />
-
-      {/* 回転する箱 */}
-      <mesh>
-        <boxGeometry />
-        <meshStandardMaterial color="hotpink" />
-      </mesh>
-    </>
-  )
-}
-
-export default function App() {
-  return (
-    <Canvas>
-      {/* 背景色 */}
-      <color attach="background" args={['#101010']} />
-
-      {/* マウス操作 */}
-      <OrbitControls />
-
-      {/* シーンコンポーネント */}
-      <Scene />
-    </Canvas>
-  )
-}
+export { default } from './components/App'

```

#### `src/components/App.tsx` (新規作成)

```typescript
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'

export default function App() {
  return (
    <Canvas>
      {/* 背景色 */}
      <color attach="background" args={['#101010']} />

      {/* マウス操作 */}
      <OrbitControls />

      {/* シーンコンポーネント */}
      <Scene />
    </Canvas>
  )
}
```

#### `src/components/Scene.tsx` (新規作成)

```typescript
// import { Canvas } from '@react-three/fiber' // この行は実際には不要ですが、元のファイル構造を維持するために残します。後で削除できます。

export function Scene() {
  return (
    <>
      {/* ライト */}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 3, 3]} intensity={3} />

      {/* 回転する箱 */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}
```
*編集注: `src/components/Scene.tsx` の `import { Canvas } ...` は不要なため、コメントアウトまたは削除を推奨します。ここでは元の指示に基づきコメントアウトされた状態で記載しています。*


#### `src/main.tsx`

```diff
--- a/src/main.tsx
+++ b/src/main.tsx
@@ -1,6 +1,6 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
-import App from './App.tsx'
+import App from './components/App.tsx'
 import './index.css'

 ReactDOM.createRoot(document.getElementById('root')!).render(

```

## 4. 想定される影響

- このリファクタリングにより、コードベースの構造がより明確になり、将来の機能追加やメンテナンスが容易になります。
- 既存の機能や動作に変更はありません。

## 5. リスク

- インポートパスの誤りによるアプリケーションのビルドエラーやランタイムエラーの可能性。 (テストと確認によって軽減されます)

## 6. 今後の作業

- 必要に応じて、`src/components/Scene.tsx` 内の不要な `import { Canvas } from '@react-three/fiber'` を削除します。
- コードレビューとテストを実施します。
