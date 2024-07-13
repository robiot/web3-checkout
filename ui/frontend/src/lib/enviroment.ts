export const enviroment = {
  WI_APP_ID:
    (process.env.NEXT_PUBLIC_WI_APP_ID as `app_${string}`) ??
    ("app_staging_cef906a1a2d3cf84ab96d0f9792395ec" as `app_${string}`),

  BACKEND_URL: "http://localhost:8080",
  CONTRACT_ADDRESS:
    "0xd37de061784c153f40bad5097aeb97d25c0c4be3" as `0x${string}`,
};
