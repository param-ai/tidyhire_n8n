import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
} from 'n8n-workflow';

export const TIDYHIRE_BASE_API_PRODUCTION_URL = 'http://localhost:3000';
export const TIDYHIRE_BASE_API_STAGING_URL = 'http://localhost:3000';
// export const TIDYHIRE_BASE_API_URL = 'https://api-staging.tidyhire.app';
// export const TIDYHIRE_BASE_API_URL = 'http://localhost:3000';
/**
 * Make an API request to Tidyhire
 *
 */
export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	uri?: string,
	option: IDataObject = {},
) {
	query = query || {};

	const options: IRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		uri: uri || `${TIDYHIRE_BASE_API_PRODUCTION_URL}${endpoint}`,
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
