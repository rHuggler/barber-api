import * as yup from 'yup';

export const sessionSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
