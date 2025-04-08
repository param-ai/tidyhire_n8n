import type {
	IAuthenticateGeneric, Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OpenAIApi implements ICredentialType {
	name = 'openAIApi';

	displayName = 'Open AI API';

	icon: Icon =  'file:openai.svg'

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
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.openai.com/v1',
			url: '/models',
		},
	};
}
