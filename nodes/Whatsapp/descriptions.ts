import type { INodeProperties } from 'n8n-workflow';

export const whatsappNumberProperties: INodeProperties[] = [
	{
		displayName: 'Whatsapp Account',
		name: 'whatsappBusinessAccount',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappAccount',
			loadOptionsDependsOn: ['workspace'],
		},
	},
];
