import type { INodeProperties } from 'n8n-workflow';

export const authProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'hidden',
		default: 'tidyhireApi',
	},
];

export const workspaceProperties: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: 'workspace',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
	},
];

export const projectProperties: INodeProperties[] = [
	{
		displayName: 'Project Name or ID',
		name: 'project',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
			loadOptionsDependsOn: ['workspace'],
		},
		noDataExpression:true
	},
];

export const whatsappBusinessAccountProperties: INodeProperties[] = [
	{
		displayName: 'Whatsapp Account',
		name: 'whatsappBusinessAccount',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappBusinessAccount',
			loadOptionsDependsOn: ['workspace'],
		},
	},
];


export const candidateProperties: INodeProperties[] = [
	{
		displayName: 'Candidate Name or ID',
		name: 'candidate',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getCandidates',
			loadOptionsDependsOn: ['project'],
		},
	},
];

export const candidateEmailProperties: INodeProperties[] = [
	{
		displayName: 'Candidate Email',
		name: 'candidatePhoneNumber',
		type: 'options',
		description: 'Recipient’s phone number in international format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getCandidatesPhoneNumbers',
			loadOptionsDependsOn: ['candidate'],
		},
		required: true,
	},
];


export const candidatePhoneProperties: INodeProperties[] = [
	{
		displayName: 'Candidate Phone Number Name or ID',
		name: 'candidatePhoneNumber',
		type: 'options',
		description: 'Recipient’s phone number in international format. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getCandidatesPhoneNumbers',
			loadOptionsDependsOn: ['candidate'],
		},
		required: true,
	},
];







