export const enviroment = {
  WI_APP_ID:
    (process.env.NEXT_PUBLIC_WI_APP_ID as `app_${string}`) ??
    ("app_staging_cef906a1a2d3cf84ab96d0f9792395ec" as `app_${string}`),

  BACKEND_URL: "http://localhost:8080",
  CONTRACT_ADDRESS:
    "0xd4894e2dfdb6563bfde8bef56227cedcf8c4ecd0" as `0x${string}`,
  TOKEN_ADDRESS: "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8" as `0x${string}`,
};
