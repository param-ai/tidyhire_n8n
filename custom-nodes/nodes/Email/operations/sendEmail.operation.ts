import type {  INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from 'n8n-workflow';

/* -------------------------------------------------------------------------- */
/*                                email:sendEmail                             */
/* -------------------------------------------------------------------------- */

const properties: INodeProperties[] = [
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'admin@example.com',
		description:
			'Email address of the sender. You can also specify a name: Nathan Doe &lt;nate@n8n.io&gt;.',
	},
	{
		displayName: 'To Email',
		name: 'toEmail',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'info@example.com',
		description:
			'Email address of the recipient. You can also specify a name: Nathan Doe &lt;nate@n8n.io&gt;.',
	},
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		placeholder: 'Select a template...',
		description: 'The Template you want to send',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a template...',
				typeOptions: {
					searchListMethod: 'getTemplates',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		placeholder: 'My subject line',
		description: 'Subject line of the email',
	},
	{
		displayName: 'HTML',
		name: 'html',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		description: 'HTML text message of email',
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Send Later?',
				name: 'isScheduled',
				type: 'boolean',
				default: false,
				description: 'Enable this to schedule the template for a later time',
			},
			{
				displayName: 'Schedule Time',
				name: 'scheduleTime',
				type: 'dateTime',
				default: '',
				description: 'Time to send the message',
				displayOptions: {
					show: {
						isScheduled: [true],
					},
				},
			},
			{
				displayName: 'Append Tidyhire Attribution',
				name: 'appendAttribution',
				type: 'boolean',
				default: true,
				description:
					'Whether to include the phrase “This email was sent automatically with Tidyhire” to the end of the email',
			},
			{
				displayName: 'Attachments',
				name: 'attachments',
				type: 'string',
				default: '',
				description:
					'Name of the binary properties that contain data to add to email as attachment. Multiple ones can be comma-separated. Reference embedded images or other content within the body of an email message, e.g. &lt;img src="cid:image_1"&gt;',
			},
			{
				displayName: 'CC Email',
				name: 'ccEmail',
				type: 'string',
				default: '',
				placeholder: 'cc@example.com',
				description: 'Email address of CC recipient',
			},
			{
				displayName: 'BCC Email',
				name: 'bccEmail',
				type: 'string',
				default: '',
				placeholder: 'bcc@example.com',
				description: 'Email address of BCC recipient',
			},
			{
				displayName: 'Ignore SSL Issues (Insecure)',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				default: false,
				description: 'Whether to connect even if SSL certificate validation is not possible',
			},
			{
				displayName: 'Reply To',
				name: 'replyTo',
				type: 'string',
				default: '',
				placeholder: 'info@example.com',
				description: 'The email address to send the reply to',
			},
		],
	},
];



const displayOptions = {
	show: {
		// resource: ['whatsapp'],
		operation: ['sendEmail'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
