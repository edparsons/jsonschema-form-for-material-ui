/* eslint-disable */
export default (schema, value, isSubmitted) => {
  if (
    schema.required &&
    isSubmitted &&
    (value === undefined || value === null || value === '')
  ) {
    return { message: `'${schema.title}' is required` };
  }
  return null;
};
