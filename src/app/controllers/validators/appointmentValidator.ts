import * as yup from 'yup';

export const appointmentSchema = yup.object().shape({
  date: yup.date().required(),
  providerId: yup.number().required(),
  userId: yup.number(),
});
