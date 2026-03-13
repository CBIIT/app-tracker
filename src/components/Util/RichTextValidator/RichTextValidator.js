export const isRichTextEditorEmpty = (value) => {
	return value.replace(/<[^>]*>/g, '').trim().length === 0;
};
