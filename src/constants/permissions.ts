// permissions.ts
export const Permissions = {
  // CUSTOMER PERMISSIONS
  CUSTOMER: {
    PROFILE: {
      VIEW: "customer_profile_view",
      EDIT: "customer_profile_edit",
      DELETE: "customer_account_delete",
      CHANGE_PASSWORD: "customer_change_password",
    },
    ORDER: {
      CREATE: "customer_order_create",
      VIEW: "customer_order_view",
      CANCEL: "customer_order_cancel",
      TRACK: "customer_order_track",
      RATE_DRIVER: "customer_rate_driver",
    },
    PAYMENT: {
      ADD_METHOD: "customer_payment_add_method",
      REMOVE_METHOD: "customer_payment_remove_method",
      VIEW_HISTORY: "customer_payment_view_history",
      MAKE_PAYMENT: "customer_make_payment",
    },
    NOTIFICATIONS: {
      RECEIVE_ORDER_UPDATES: "customer_receive_order_updates",
      SUBSCRIBE_PROMOTIONS: "customer_subscribe_promotions",
    },
  },

  // DRIVER PERMISSIONS
  DRIVER: {
    PROFILE: {
      VIEW: "driver_profile_view",
      EDIT: "driver_profile_edit",
      SET_AVAILABILITY: "driver_set_availability",
      CHANGE_PASSWORD: "driver_change_password",
    },
    DELIVERY: {
      VIEW_ASSIGNED_ORDERS: "driver_view_assigned_orders",
      ACCEPT_ORDER: "driver_accept_order",
      DECLINE_ORDER: "driver_decline_order",
      UPDATE_STATUS: "driver_update_order_status",
      VIEW_HISTORY: "driver_view_delivery_history",
      REPORT_ISSUE: "driver_report_issue",
    },
    NAVIGATION: {
      SHARE_LOCATION: "driver_share_location",
      VIEW_ROUTE: "driver_view_route",
    },
    EARNINGS: {
      VIEW: "driver_view_earnings",
      WITHDRAW: "driver_request_withdrawal",
    },
  },

  // ADMIN PERMISSIONS
  ADMIN: {
    USERS: {
      VIEW: "admin_view_users",
      CREATE: "admin_create_user",
      EDIT: "admin_edit_user",
      DELETE: "admin_delete_user",
      ASSIGN_ROLES: "admin_assign_roles",
    },
    ROLES: {
      CREATE: "admin_create_role",
      EDIT: "admin_edit_role",
      DELETE: "admin_delete_role",
      ASSIGN_PERMISSIONS: "admin_assign_permission_to_role",
    },
    ORDERS: {
      VIEW_ALL: "admin_view_all_orders",
      UPDATE_STATUS: "admin_update_order_status",
      CANCEL: "admin_cancel_order",
      VIEW_DRIVER_PERFORMANCE: "admin_view_driver_performance",
    },
    FINANCE: {
      VIEW_PAYMENTS: "admin_view_payments",
      REFUND: "admin_refund_payment",
      MANAGE_COMMISSION: "admin_manage_commission",
    },
    REPORTS: {
      VIEW: "admin_view_reports",
      GENERATE: "admin_generate_reports",
    },
    SYSTEM: {
      MANAGE_NOTIFICATIONS: "admin_manage_notifications",
      MANAGE_PROMOTIONS: "admin_manage_promotions",
      MANAGE_SETTINGS: "admin_manage_app_settings",
      MANAGE_API_KEYS: "admin_manage_api_keys",
    },
    SUPPORT: {
      RESPOND_TO_QUERIES: "admin_respond_to_customer_queries",
      VIEW_COMPLAINTS: "admin_view_complaints",
    },
  },
} as const;

function flattenPermissions(
  obj: any,
  prefix = ""
): { key: string; name: string }[] {
  const result: { key: string; name: string }[] = [];

  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      result.push({ key: v, name: v.replace(/_/g, " ") }); // optional: prettify name
    } else {
      result.push(...flattenPermissions(v, `${prefix}${k}_`));
    }
  }

  return result;
}

export const permissions = flattenPermissions(Permissions);

export const permissionsObject: {[Key: string]: string;} = {};
flattenPermissions(Permissions).forEach(el=> {
  permissionsObject[el.key] = el.key;
});

