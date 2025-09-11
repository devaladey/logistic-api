import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const getRoles = catchAsync(async (req, res, next) => {
  const roles = await prisma.role.findMany();
  sendSuccess(res, {
    message: "Roles fetched successfully",
    data: {
      results: roles.length,
      data: roles,
    },
  });
});

export const createRole = catchAsync(async (req, res, next) => {
  const role = await prisma.role.create({
    data: {
      name: req.body.name,
      description: req.body.description,
    },
  });

  sendSuccess(res, {
    message: "Role created successfully",
    data: {
      data: role,
    },
  });
});

export const assignPermissionToRole = catchAsync(async (req, res, next) => {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        permissionId: req.body.permissionId,
        roleId: req.body.roleId,
      },
    },
    create: {
      permissionId: req.body.permissionId,
      roleId: req.body.roleId,
    },
    update: {},
  });

  sendSuccess(res, {
    message: "Permission assigned to role successfully"
  });
});

export const unAssignPermissionToRole = catchAsync(async (req, res, next) => {
  await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        permissionId: req.body.permissionId,
        roleId: req.body.roleId,
      },
    }
  });

  sendSuccess(res, {
    message: "Permission unassigned to role successfully"
  });
});
