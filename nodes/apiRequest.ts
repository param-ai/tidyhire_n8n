import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IPollFunctions,
	IRequestOptions,
} from 'n8n-workflow';

/**
 * Make an API request to Tidyhire
 *
 */
export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	uri?: string,
	option: IDataObject = {},
) {
	query = query || {};

	const workspace = this.getNodeParameter('workspace', 0) as string;

	if (!query?.workspace && workspace) {
		query.workspace = workspace;
	}

	const options: IRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		uri: uri || `http://localhost:3000${endpoint}`,
		useQuerystring: false,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;

	return await this.helpers.requestWithAuthentication.call(this, authenticationMethod, options);
}
