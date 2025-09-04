import AppError from "../../utils/app-error";

export const signupValidateSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 8 },
  confirmPassword: {
    custom: (val: any, data: Record<string, any>) => {
      if (val !== data?.password) {
        throw new AppError("Passwords do not match.", 400);
      }
    },
  },
  phone: { required: true, regex: /^\d{10,15}$/ }, // optional
  signupMethod: { required: true },
};

export const userValidationSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 8 },
  confirmPassword: {
    custom: (val: any, data: Record<string, any>) => {
      if (val !== data?.password) {
        throw new AppError("Passwords do not match.", 400);
      }
    },
  },
  phone: { regex: /^\d{10,15}$/ }, // optional
  signupMethod: { required: true },
};
