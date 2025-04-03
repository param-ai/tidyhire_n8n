import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

import * as whatsapp from './Whatsapp/operations';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const items = this.getInputData();

	const operation = this.getNodeParameter('operation', 0);

	console.log(operation);
	console.log(items);

	try {
		switch (operation) {
			case 'sendTemplate':
			case 'sendSessionMessage':
				returnData = await whatsapp[operation].execute.call(this);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} catch (error) {
		if (
			error.description &&
			(error.description as string).includes('cannot accept the provided value')
		) {
			error.description = `${error.description}. Consider using 'Typecast' option`;
		}
		throw error;
	}
	console.log(returnData);
	return [returnData];
}
