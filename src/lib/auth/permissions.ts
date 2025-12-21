import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	location: ["read"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({});

export const admin = ac.newRole({
	location: ["read"],
	...adminAc.statements,
});

export const locationAccess = ac.newRole({
	location: ["read"]
});
