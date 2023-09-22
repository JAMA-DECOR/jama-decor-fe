import { roles } from "../constants/app";

export const mockAccounts = [
	{
		id: "1",
		fullName: "Nguyen Van A",
		email: "admin@gmail.com",
		password: '123456',
		role: roles.ADMIN,
		birthday: '15/03/2001',
		address: 'Toà nhà K, đường số 8, khu 15, quận 9, thành phố Hồ Chí Minh',
		phone: '0975790652',
		isBan: false,
		active: true,
	},
	{
		id: "2",
		fullName: "Nguyen Van B",
		email: "factory@gmail.com",
		password: '123456',
		role: roles.FACTORY,
		birthday: '20/10/1986',
		address: 'Toà nhà S, đường số 4, khu 1, quận 9, thành phố Hồ Chí Minh',
		phone: '0975790200',
		isBan: false,
		active: true,
	},
	{
		id: "3",
		fullName: "Nguyen Van C",
		email: "leader@gmail.com",
		password: '123456',
		role: roles.LEADER,
		birthday: '12/08/1999',
		address: 'Toà nhà 102, đường E, khu 7, quận 9, thành phố Hồ Chí Minh',
		phone: '0916772234',
		isBan: false,
		active: true,
	},


	{
		id: "4",
		fullName: "Tran Thi S",
		email: "worker@gmail.com",
		password: '123456',
		role: roles.WORKER,
		birthday: '20/10/1991',
		address: 'Toà nhà C12, đường SS, khu 6, quận 9, thành phố Hồ Chí Minh',
		phone: '0956123254',
		isBan: true,
		active: false,
	},
	{
		id: "5",
		fullName: "Nguyen Van D",
		email: "worker@gmail.com",
		password: '123456',
		role: roles.WORKER,
		birthday: '20/10/2000',
		address: 'Toà nhà C12, đường SS, khu 6, quận 9, thành phố Hồ Chí Minh',
		phone: '0838226447',
		isBan: false,
		active: true,
	},
];

export const mockStudents = [
	{
		id: "3",
		fullName: "Nguyễn Thanh Huyền",
		email: "huyenthanh@fpt.edu.com",
		role: roles.WORKER,
		active: true,
		team: {
			name: "Nhóm 1",
			members: [
				{
					name: "Trần Hạo Nam",
				},
				{
					name: "Bùi Văn Công",
				},
			],
		},
	},
	{
		id: "4",
		fullName: "Trần Vĩnh Phát",
		email: "phatvinh@fpt.edu.com",
		role: roles.WORKER,
		active: true,
	},
	{
		id: "5",
		fullName: "Lê Văn Vũ",
		email: "vule@fpt.edu.com",
		role: roles.WORKER,
		active: true,
	},
];
