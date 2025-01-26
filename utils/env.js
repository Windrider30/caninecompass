export const validateEnv = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_DOG_API_KEY',
    'NEXT_PUBLIC_DOG_API_URL',
    'NEXT_PUBLIC_PIXABAY_API_KEY',
    'NEXT_PUBLIC_PIXABAY_API_URL',
    'NEXT_PUBLIC_SITE_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
};
