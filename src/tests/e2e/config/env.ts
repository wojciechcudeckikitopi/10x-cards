export const getTestCredentials = () => {
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "E2E test credentials not found. Please ensure E2E_USERNAME and E2E_PASSWORD are set in .env.test file"
    );
  }

  return {
    username,
    password,
  };
};
