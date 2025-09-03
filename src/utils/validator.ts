import AppError from "./app-error";

type ValidationRule = {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  required?: boolean;
  min?: number;
  max?: number;
};

type ValidationSchema = Record<string, ValidationRule>;

export const validateInput = (
  data: Record<string, any>,
  schema: ValidationSchema
) => {
  for (const field in schema) {
    const value = data[field];
    const rules = schema[field];

    // 1️⃣ Required check
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      throw new AppError(
        `The '${field}' field is required. Please provide a value.`,
        400
      );
    }

    // 2️⃣ Type & length checks for strings
    if (typeof value === "string") {
      if (rules.minLength && value.length < rules.minLength) {
        throw new AppError(
          `'${field}' must be at least ${rules.minLength} characters long.`,
          400
        );
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        throw new AppError(
          `'${field}' must be at most ${rules.maxLength} characters long.`,
          400
        );
      }
    }

    // 3️⃣ Regex validation
    if (rules.regex && typeof value === "string" && !rules.regex.test(value)) {
      throw new AppError(`'${field}' has an invalid format.`, 400);
    }

    // 3️⃣ Number checks: min & max
    if (typeof value === "number") {
      if (rules.min !== undefined && value < rules.min) {
        throw new AppError(`'${field}' must be at least ${rules.min}.`, 400);
      }

      if (rules.max !== undefined && value > rules.max) {
        throw new AppError(`'${field}' must be at most ${rules.max}.`, 400);
      }
    }

  }
};

export const userValidationSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 8 },
  phone: { regex: /^\d{10,15}$/ }, // optional
  signupMethod: { required: true },
};
