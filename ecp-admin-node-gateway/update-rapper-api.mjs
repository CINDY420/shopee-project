#! ./node_modules/.bin/zx
await Promise.all([
  // for ECP Admin / ecp-admin-backend-apis (https://rap.shopee.io/organization/repository/editor?id=227)
  $`npx rapper --type normal --rapperPath "src/rapper/ecpApis/client" --apiUrl "https://rap.shopee.io/api/repository/get?id=227&token=AVxyPvBEoFJL4ZePi9SHG3m6jk2L7WaP" --rapUrl "https://rap.shopee.io"`,
  $`npx rapper --type dto --rapperPath "src/rapper/ecpApis/dtos" --apiUrl "https://rap.shopee.io/api/repository/get?id=227&token=AVxyPvBEoFJL4ZePi9SHG3m6jk2L7WaP" --rapUrl "https://rap.shopee.io"`,

  // for ECP Admin / Source of truth for ENV/CID/AZ (https://rap.shopee.io/organization/repository/editor?id=228)
  $`npx rapper --type normal --rapperPath "src/rapper/spaceAZ/client" --apiUrl "https://rap.shopee.io/api/repository/get?id=228&token=v28b_OZQ6Y2IFr0S-I6XuRdEkZx8llNk" --rapUrl "https://rap.shopee.io"`,
  $`npx rapper --type dto --rapperPath "src/rapper/spaceAZ/dtos" --apiUrl "https://rap.shopee.io/api/repository/get?id=228&token=v28b_OZQ6Y2IFr0S-I6XuRdEkZx8llNk" --rapUrl "https://rap.shopee.io"`,

  // for ECP Admin / Space UIC v2 API (https://rap.shopee.io/organization/repository/editor?id=234)
  $`npx rapper --type normal --rapperPath "src/rapper/spaceUIC/client" --apiUrl "https://rap.shopee.io/api/repository/get?id=234&token=urB8y3DLmZiEtphN4v85bXJiTOeiIvVt" --rapUrl "https://rap.shopee.io"`,
  $`npx rapper --type dto --rapperPath "src/rapper/spaceUIC/dtos" --apiUrl "https://rap.shopee.io/api/repository/get?id=234&token=urB8y3DLmZiEtphN4v85bXJiTOeiIvVt" --rapUrl "https://rap.shopee.io"`,

  // for ECP Admin / CMDB - API (https://rap.shopee.io/organization/repository/editor?id=247)
  $`npx rapper --type normal --rapperPath "src/rapper/spaceCMDB/client" --apiUrl "https://rap.shopee.io/api/repository/get?id=247&token=BCZAke6PlIRH7096Lpce6v6oSMZxRqcw" --rapUrl "https://rap.shopee.io"`,
  $`npx rapper --type dto --rapperPath "src/rapper/spaceCMDB/dtos" --apiUrl "https://rap.shopee.io/api/repository/get?id=247&token=BCZAke6PlIRH7096Lpce6v6oSMZxRqcw" --rapUrl "https://rap.shopee.io"`,
])
