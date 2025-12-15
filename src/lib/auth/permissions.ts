import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
    location: ["read", "update"],
    git: ["read"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    ...defaultStatements,
    git: ["read"],
});

export const admin = ac.newRole({
    ...adminAc.statements,
    location: ["read", "update"],
});

export const locationAccess = ac.newRole({
    location: ["read"],
});
