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
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://localhost:3000',
			url: '/test-access-token',
			json: true,
			ignoreHttpStatusErrors: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'success',
					value: false,
					message: 'Invalid Access Token',
				},
			},
		],
	};
}
