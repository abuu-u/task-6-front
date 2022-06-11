import * as yup from 'yup'

export const settingsSchema = yup.object().shape({
  seed: yup.number().required(),
  locale: yup.string().required(),
  errorsCount: yup.number().min(0).max(1000).required(),
})
