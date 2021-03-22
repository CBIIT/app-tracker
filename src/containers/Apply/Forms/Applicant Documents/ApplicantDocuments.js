import FormContext from '../../Context';
import React, { useState, useEffect, useContext } from 'react'
import { Form, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import './ApplicantDocuments.css'

const ApplicantDocuments = () => {
  const [formInstance] = Form.useForm()
  const contextValue = useContext(FormContext)
  const { formData } = contextValue

  const initialCV = formData.documents.cv || { fileList: [] }
  const initialLetter = formData.documents.letter || { fileList: [] }
  const initialStatement = formData.documents.statement || { fileList: [] }

  const [stateCV, setStateCV] = useState({
    fileList: initialCV.fileList,
    uploading: false,
  })
  const [stateLetter, setStateLetter] = useState({
    fileList: initialLetter.fileList,
    uploading: false,
  })
  const [stateR, setStateR] = useState({
    fileList: initialStatement.fileList,
    uploading: false,
  })

  useEffect(() => {
    const { setCurrentFormInstance } = contextValue
    setCurrentFormInstance(formInstance)
  }, [])

  const propsCV = {
    onRemove: (file) => {
      setStateCV((stateCV) => {
        const index = stateCV.fileList.indexOf(file)
        const newFileList = stateCV.fileList.slice()
        newFileList.splice(index, 1)
        return {
          fileList: newFileList,
        }
      })
    },
    beforeUpload: (file) => {
      const size = file.size / 1024 / 1024 < 3;
      if (!size) message.error('Document should be less than 3MB!');
      else 
      setStateCV((stateCV) => ({
        fileList: [...stateCV.fileList, file],
      }))
      return false
    },
    fileList: stateCV.fileList,
    accept: '.docx, .pdf, .doc'
  }

  const propsLetter = {
    onRemove: (file) => {
      setStateLetter((stateLetter) => {
        const index = stateLetter.fileList.indexOf(file)
        const newFileList = stateLetter.fileList.slice()
        newFileList.splice(index, 1)
        return {
          fileList: newFileList,
        }
      })
    },
    beforeUpload: (file) => {
      const size = file.size / 1024 / 1024 < 3;
      if (!size) message.error('Document should be less than 3MB!');
      else 
      setStateLetter((stateLetter) => ({
        fileList: [...stateLetter.fileList, file],
      }))
      return false
    },
    fileList: stateLetter.fileList,
    accept: '.docx, .pdf, .doc'
  }

  const propsR = {
    onRemove: (file) => {
      setStateR((stateR) => {
        const index = stateR.fileList.indexOf(file)
        const newFileList = stateR.fileList.slice()
        newFileList.splice(index, 1)
        return {
          fileList: newFileList,
        }
      })
    },
    beforeUpload: (file) => {
      const size = file.size / 1024 / 1024 < 3;
      if (!size) message.error('Document should be less than 3MB!');
      else 
      setStateR((stateR) => ({
        fileList: [...stateR.fileList, file],
      }))
      return false
    },
    fileList: stateR.fileList,
    accept: '.docx, .pdf, .doc'
  }

  return (
    <Form form={formInstance}>
      <p>
        Please upload the following documents. Each file cannot exceed 3
        megabytes in size. We prefer tht youy submit documents in PDF format,
        but we can also accept Microsoft Word (.doc/.docx) or PDF(.pdf) format.
      </p>
      <div className="upload-documents">

      <div className="document-row">
          <div className="document-title">CV and complete bibliography: </div>
          <div style={{display:"flex", alignItems:"baseline"}}>
            <Form.Item name='cv' initialValue={initialCV}>
              <Upload {...propsCV}>
                <Button disabled={stateCV.fileList.length}>
                  <UploadOutlined /> Select File
                </Button>
              </Upload>
            </Form.Item>
            <div className="doc-types"> allowed: .doc, .docx, .pdf</div>
          </div>
        </div>

        <div className="document-row">
        <div className="document-title">
            Letter of interest including career synopsis:{' '}
          </div>
          <div style={{display:"flex", alignItems:"baseline"}}>
            <Form.Item name='letter' initialValue={initialLetter}>
              <Upload {...propsLetter} >
                <Button disabled={stateLetter.fileList.length}>
                  <UploadOutlined /> Select File
                </Button>
              </Upload>
            </Form.Item>
            <div className="doc-types"> allowed:  .doc, .docx, .pdf</div>
          </div>
        </div>

        <div className="document-row">
        <div className="document-title">Statement of Research Interests: </div>
          <div style={{display:"flex", alignItems:"baseline"}}>
            <Form.Item name='statement' initialValue={initialStatement}>
              <Upload {...propsR}>
                <Button disabled={stateR.fileList.length}>
                  <UploadOutlined /> Select File
                </Button>
              </Upload>
            </Form.Item>
            <div className="doc-types"> allowed:  .doc, .docx, .pdf</div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default ApplicantDocuments
