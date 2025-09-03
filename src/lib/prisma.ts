import { SignupMethod, PrismaClient } from "../generated/prisma";

export const prisma = new PrismaClient();
export const SignupMethodEnum = SignupMethod;