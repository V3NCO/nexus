import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement = {
	...adminAc.statements,
	location: ['read', 'update'],
	git: ['read']
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
	user: [...defaultStatements.user],
	session: [...defaultStatements.session],
	git: ['read']
});

export const admin = ac.newRole({
	...adminAc.statements,
	location: ['read', 'update']
});

export const locationAccess = ac.newRole({
	location: ['read']
});
