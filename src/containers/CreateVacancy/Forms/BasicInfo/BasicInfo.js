import React, { useState } from 'react';
import { Form, Input, Slider, DatePicker, Radio } from 'antd';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

import InputWithCheckbox from '../../../../components/UI/InputWithCheckbox/InputWithCheckbox';

import './BasicInfo.css';



const BasicInformation = () => {
    const [form] = Form.useForm();
    const [formLayout] = useState('vertical');

    const [value, setValue] = useState(1);

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const [contentEditor, setContentEditor] = useState();
    const handleEditorChange = (content) => {
        console.log('Content was updated:', content);
        setContentEditor(content);
    }

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            }
            : null;

    const sliderMarks = {
        1: '1',
        2: '2',
        3: '3'
    }

    return (
        <Form {...formItemLayout}
            layout={formLayout}
            form={form}
            initialValues={{
                layout: formLayout,
            }}
            requiredMark={false}
        >
            <Form.Item
                label='Position Title'
                name='positionTitle'
                rules={[{ required: true, message: 'Please enter' }]}
            >
                <Input placeholder='Please enter' />
            </Form.Item>

            <Form.Item
                label='Position Description'
                name='description'
            >
                <Editor
                    init={{
                        skin: false,
                        content_css: false,
                        height: 500,
                        menubar: false,
                        branding: false,
                        elementpath: false,
                        statusbar: false,
                        plugins: [
                            'link image',
                            'table paste'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                    }}
                    value={contentEditor}
                    onEditorChange={handleEditorChange}
                />
            </Form.Item>

            <div className='DatePickerContainer'>
                <Form.Item
                    label='Open Date'
                    name='openDate'
                    rules={[{ required: true, message: 'Please select an open date' }]}
                >

                    <DatePicker className='DatePicker' />
                </Form.Item>

                <Form.Item
                    label='Close Date'
                    name='closeDate'
                    rules={[{ required: true, message: "Please select a close date" }]}
                >
                    <DatePicker className='DatePicker' />
                </Form.Item>
            </div>


            <Form.Item
                label='Application Documents'
                name='applicationDocuments'
                rules={[{}]}
            >
                <InputWithCheckbox />
            </Form.Item>

            <Form.Item
                label='Letters of Recommendation'
                name='lettersOfRecommendation'
            >
                <p className='SmallText'>How would you like applicants to submit recommendations?</p>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio className='Radio' value={1}>Upload letters of recommendation</Radio>
                    <Radio className='Radio' value={2}>Provide reference contact details</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label=''
                name='numberOfRecommendations'
                rules={[{}]}
            >
                <p className='SmallText'>How would you like applicants to submit recommendations?</p>

                <Slider className='Slider' min={1} max={3} defaultValue={3} dots marks={sliderMarks} />


            </Form.Item>
        </Form>
    )
}

export default BasicInformation
