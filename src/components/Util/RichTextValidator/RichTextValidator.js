export const isRichTextEditorEmpty = (value) => {
	return value.replace(/<(.|\n)*?>/g, '').trim().length === 0;
};
