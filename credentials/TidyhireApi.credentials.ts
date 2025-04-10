import type {
	IAuthenticateGeneric, Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TidyhireApi implements ICredentialType {
	name = 'tidyhireApi';

	displayName = 'Tidyhire API';

	icon: Icon =  'file:tidyhire.svg'

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Api-Key {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://localhost:3000',
			url: '/test-api-key',
			json: true,
			ignoreHttpStatusErrors: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'success',
					value: false,
					message: 'Invalid API Key, Contact Tidyhire Support.',
				},
			},
		],
	};
}
