import { isRichTextEditorEmpty } from './RichTextValidator';

describe('isRichTextEditorEmpty', () => {
	it('returns false for non-empty rich text content', () => {
		const value = '<p>This is a test</p>';
		expect(isRichTextEditorEmpty(value)).toBe(false);
	});

	it('returns true for empty rich text content', () => {
		const value = '<p></p>';
		expect(isRichTextEditorEmpty(value)).toBe(true);
	});

	it('returns true for content with only HTML tags', () => {
		const value = '<div><br></div>';
		expect(isRichTextEditorEmpty(value)).toBe(true);
	});

	it('returns true for content with only spaces', () => {
		const value = '   ';
		expect(isRichTextEditorEmpty(value)).toBe(true);
	});

	it('returns true for content with only HTML tags and spaces', () => {
		const value = '<div>   </div>';
		expect(isRichTextEditorEmpty(value)).toBe(true);
	});

	it('returns false for content with text and HTML tags', () => {
		const value = '<div>Some text</div>';
		expect(isRichTextEditorEmpty(value)).toBe(false);
	});

	it('returns false for content with text and spaces', () => {
		const value = '   Some text   ';
		expect(isRichTextEditorEmpty(value)).toBe(false);
	});
});