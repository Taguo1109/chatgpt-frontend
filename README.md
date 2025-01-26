# ChatGPT React 應用程式

這是一個使用 React 建置的簡單聊天介面，您可以透過它與 OpenAI 的 GPT 模型互動。

## 快速開始

按照以下步驟啟動並運行此應用程式：

### 1. 複製專案

將此專案複製到本地端：

```bash
git clone <https://github.com/Taguo1109/chatgpt-frontend.git>
cd <所儲存的資料夾>
```

### 2. 安裝依賴

使用 Yarn 安裝所需的依賴套件：

```bash
yarn install
```

### 3. 取得 OpenAI API 金鑰

1. 前往 [OpenAI API 金鑰](https://platform.openai.com/settings/organization/api-keys) 頁面。
2. 生成一組新的 API 金鑰。
3. 在 [帳單設定](https://platform.openai.com/settings/organization/billing/overview) 中設定信用卡資料並充值，否則即使擁有 API 金鑰，也無法使用該服務。

### 4. 設定環境變數

在專案根目錄下建立一個 `.env` 文件，並新增以下內容：

```env
REACT_APP_OPENAI_API_KEY='你的-openai-api-key'
```

> **注意：** 將 `你的-openai-api-key` 替換為您從 OpenAI 獲取的實際金鑰。

### 5. 啟動開發伺服器

啟動應用程式：

```bash
yarn start
```

在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000)，即可開始與您的 GPT 模型互動！

---

## 可用指令

### `yarn start`

啟動開發模式伺服器。

### `yarn test`

執行測試，進入互動式檢視模式。

### `yarn build`

將應用程式打包為生產環境版本，輸出檔案將位於 `build` 資料夾中。

### `yarn eject`

將所有配置檔案和依賴複製到專案中，讓您完全自定義。**注意：此操作不可逆。**

---

## 功能特色

- 即時與 OpenAI GPT 模型互動。
- 模擬打字效果，提升使用體驗。
- 支援行動裝置，設計響應式界面。

---

## 注意事項

- 請確保您擁有有效的 API 金鑰，並已在 OpenAI 設定有效的帳單資訊。否則，API 請求將無法執行。
- 使用 OpenAI 的 GPT API 可能會產生費用，請注意監控您的使用量。

---

## 更多資訊

- 瞭解 Create React App，請參考 [官方文件](https://facebook.github.io/create-react-app/docs/getting-started)。
- 瞭解 React，請參考 [React 官方文件](https://reactjs.org/)。
- 瞭解 OpenAI API，請參考 [OpenAI API 文件](https://platform.openai.com/docs/)。

---