import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement = {
	...adminAc.statements,
	location: ['read'],
	git: ['read']
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
	user: [...defaultStatements.user],
	session: [...defaultStatements.session]
});

export const admin = ac.newRole({
	...adminAc.statements,
	location: ['read']
});

export const locationAccess = ac.newRole({
  user: [...defaultStatements.user],
	session: [...defaultStatements.session],
	location: ['read']
});
