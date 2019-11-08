import * as yup from 'yup';

export const userSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  provider: yup.boolean(),
  avatarId: yup.number(),
});

export const userUpdateSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  provider: yup.boolean(),
  avatarId: yup.number(),
  oldPassword: yup.string().min(6),
  password: yup.string().min(6)
    .when('oldPassword', (oldPassword: string, field: yup.StringSchema) =>
      oldPassword ? field.required() : field,
    ),
  confirmPassword: yup.string().min(6)
    .when('password', (password: string, field: yup.StringSchema) =>
      password ? field.required().oneOf([yup.ref('password')]) : field,
    ),
});
