import type { INodeProperties } from 'n8n-workflow';

export const authProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'hidden',
		default: 'tidyhireApi',
	},
];

// export const workspaceProperties: INodeProperties[] = [
// 	{
// 		displayName: 'Workspace Name or ID',
// 		name: 'workspace',
// 		type: 'options',
// 		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 		default: '',
// 		typeOptions: {
// 			loadOptionsMethod: 'getWorkspaces',
// 		},
// 	},
// ];

export const projectProperties: INodeProperties[] = [
	{
		displayName: 'Project',
		name: 'project',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		// description: 'The Airtable Base in which to operate on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getProjects',
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
		],
	},
];

export const candidateProperties: INodeProperties[] = [
	{
		displayName: 'Candidate',
		name: 'candidate',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		// description: 'The Airtable Base in which to operate on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getCandidates',
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
		],
	},
];

// export const projectProperties: INodeProperties[] = [
// 	{
// 		displayName: 'Project Id',
// 		name: 'project',
// 		type: 'string',
// 		description:
// 			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 		default: '',
// 		required: false,
// 	},
// ];

export const whatsappBusinessAccountProperties: INodeProperties[] = [
	{
		displayName: 'Whatsapp Account',
		name: 'whatsappBusinessAccount',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappBusinessAccount',
		},
	},
];
//
// export const candidateProperties: INodeProperties[] = [
// 	{
// 		displayName: 'Candidate Name or ID',
// 		name: 'candidate',
// 		type: 'options',
// 		description:
// 			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 		default: '',
// 		typeOptions: {
// 			loadOptionsMethod: 'getCandidates',
// 		},
// 	},
// ];

export const candidateEmailProperties: INodeProperties[] = [
	{
		displayName: 'Candidate Email',
		name: 'candidatePhoneNumber',
		type: 'options',
		description:
			'Recipient’s phone number in international format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getCandidatesPhoneNumbers',
			loadOptionsDependsOn: ['candidate'],
		},
		required: true,
	},
];

// export const candidatePhoneProperties: INodeProperties[] = [
// 	{
// 		displayName: 'Candidate Phone Number Name or ID',
// 		name: 'candidatePhoneNumber',
// 		type: 'options',
// 		default: '',
// 		typeOptions: {
// 			loadOptionsMethod: 'getCandidatesPhoneNumbers',
// 			loadOptionsDependsOn: ['candidate'],
// 		},
// 		required: true,
// 	},
// ];
