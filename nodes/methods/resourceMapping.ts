import {
	ILoadOptionsFunctions,
	NodeOperationError,
	ResourceMapperField,
	ResourceMapperFields,
} from 'n8n-workflow';
import { apiRequest } from '../apiRequest';

export async function getVariablesByWhatsappTemplate(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const templateName = this.getNodeParameter('templateName', undefined, {
		extractValue: true,
	}) as string;

	if (!templateName) {
		throw new Error('Please select a template first');
	}

	const { data } = await apiRequest.call(
		this,
		'GET',
		`/api/communication/whatsapp-business-api/get-template`,
		undefined,
		{
			template_name: templateName,
		},
	);

	if (!data) {
		throw new NodeOperationError(this.getNode(), 'Table information could not be found!', {
			level: 'warning',
		});
	}

	const fields: ResourceMapperField[] = [];

	for (let i = 0; i < data.variables.header.length; i++) {
		fields.push({
			id: `header-{{${i + 1}\}}`,
			displayName: `header {{${i + 1}\}}`,
			required: false,
			defaultMatch: false,
			canBeUsedToMatch: true,
			display: true,
			type: 'string',
		});
	}

	for (let i = 0; i < data.variables.body.length; i++) {
		fields.push({
			id: `body-{{${i + 1}\}}`,
			displayName: `body {{${i + 1}\}}`,
			required: false,
			defaultMatch: false,
			canBeUsedToMatch: true,
			display: true,
			type: 'string',
		});
	}

	return { fields };
}
