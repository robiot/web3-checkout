export const enviroment = {
  WI_APP_ID:
    (process.env.NEXT_PUBLIC_WI_APP_ID as `app_${string}`) ??
    ("app_staging_cef906a1a2d3cf84ab96d0f9792395ec" as `app_${string}`),
};
