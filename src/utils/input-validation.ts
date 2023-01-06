export const isValidEmail = (text: string) => {
  const regex =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return regex.test(text.toLowerCase());
};

export const isValidPassword = (text: string) => {
  const regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/;
  return regex.test(text);
};
