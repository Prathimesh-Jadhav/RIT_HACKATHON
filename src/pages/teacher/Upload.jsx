import { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import {toast} from 'react-toastify';
import { jsPDF } from 'jspdf';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [syllabusData, setSyllabusData] = useState(null);
    const [uploadingNotes, setUploadingNotes] = useState(false);

    const handleFileChange = (info) => {    
        if (info.file) {
            setFile(info.file);
            console.log('File selected:', info.file.name);
            message.success(`${info.file.name} ready for processing`);
        }
    };

    const beforeUpload = (file) => {
        const isValid = file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        if (!isValid) {
            message.error("You can only upload PDF or DOC files!");
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const downloadChapterContent = (chapterTitle, content) => {
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(16);
        pdf.text(chapterTitle, 20, 20);
        
        // Add content
        pdf.setFontSize(12);
        let y = 40;
        
        content.subpoints.forEach(point => {
            // Add subpoint title
            pdf.setFont(undefined, 'bold');
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }
            pdf.text(point.title, 20, y);
            y += 10;
            
            // Add description with word wrap
            pdf.setFont(undefined, 'normal');
            const splitText = pdf.splitTextToSize(point.description, 170);
            splitText.forEach(line => {
                if (y > 270) {
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(line, 20, y);
                y += 7;
            });
            y += 10;
        });

        pdf.save(`${chapterTitle}.pdf`);
    };

    const handleUpload = async () => {
        if (!file) {
            message.warning("Please select a file first");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload_pdf/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status !== 200) {
                throw new Error("Failed to process the file.");
            }

            const parsedData = JSON.parse(response.data.data);
            setSyllabusData(parsedData);
            message.success("Syllabus processed successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to process the file.");
        } finally {
            setUploading(false);
        }
    };

    const handleUploadFile = async (chapterTitle, content) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload_file/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                message.success("File uploaded successfully!");
            } else {
                throw new Error("Failed to upload file");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file");
        }
    };

    const handleDeleteUploadedFile = () => {
        setFile(null);
        setSyllabusData(null);
        message.success("Uploaded file deleted successfully!");
    };

    const handleUploadNotes = async (file) => {
        setUploadingNotes(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload_file/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                message.success("Notes uploaded successfully!");
            } else {
                throw new Error("Failed to upload notes");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload notes");
        } finally {
            setUploadingNotes(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[91.2vh] bg-gradient-to-br from-gray-900 to-gray-800 p-6 font-inter">
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">Syllabus to Notes Converter</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                        <div className="bg-blue-500 p-4">
                            <h2 className="text-lg font-semibold text-white text-center">Upload Your Document</h2>
                        </div>

                        <div className="p-6 flex flex-col flex-grow space-y-6">
                            <Upload.Dragger
                                name="file"
                                multiple={false}
                                beforeUpload={beforeUpload}
                                onChange={handleFileChange}
                                showUploadList={false}
                                className="bg-gray-800 border-dashed border-2 border-gray-600 hover:border-indigo-500 flex-grow"
                            >
                                <div className="py-8">
                                    <p className="text-4xl text-indigo-400 mb-4">
                                        <FileTextOutlined />
                                    </p>
                                    <p className="text-base font-medium text-gray-200">Click or drag file to upload</p>
                                    <p className="text-xs text-gray-400 mt-2">Support for PDF, DOC, DOCX</p>
                                </div>
                            </Upload.Dragger>

                            {file && (
                                <div className="p-4 bg-gray-700 rounded-lg flex items-center justify-between overflow-auto">
                                    <div className="flex items-center">
                                        <FileTextOutlined className="text-indigo-400 mr-3" />
                                        <span className="text-gray-200 font-medium truncate">{file.name}</span>
                                    </div>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteUploadedFile}
                                        size="small"
                                        className="delete-button"
                                        type="text"
                                    />
                                </div>
                            )}

                            <Button
                                type="primary"
                                onClick={handleUpload}
                                loading={uploading}
                                disabled={!file}
                                style={{ backgroundColor: "#2196F3", color: "white", marginTop: "10px" }}
                                className="h-12 text-white font-semibold"
                            >
                                {uploading ? "Processing..." : "Process Syllabus"}
                            </Button>
                        </div>
                    </div>

                    {/* Generated Content Section */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                        <div className="bg-blue-500 p-4">
                            <h2 className="text-lg font-semibold text-white text-center">Generated Content</h2>
                        </div>

                        <div className="p-6 flex-grow overflow-auto" style={{ maxHeight: '400px' }}>
                            {syllabusData ? (
                                <ul className="divide-y divide-gray-700">
                                    {Object.entries(syllabusData).map(([chapter, content], index) => (
                                        <li key={index} className="py-4 first:pt-1 last:pb-1">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center min-w-0">
                                                    <div className="p-3 bg-gray-700 rounded-lg mr-4 flex-shrink-0">
                                                        <FileTextOutlined className="text-lg text-indigo-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-medium text-gray-200 truncate">{chapter}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        icon={<DownloadOutlined />}
                                                        type="primary"
                                                        onClick={() => downloadChapterContent(chapter, content)}
                                                        style={{ backgroundColor: "#4f46e5" }}
                                                        size="middle"
                                                    >
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <FileTextOutlined className="text-5xl mb-4" />
                                    <p className="text-base">No content generated yet</p>
                                    <p className="text-xs mt-2">Upload a document to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Notes Button */}
                <div className="mt-8 flex justify-center">
                    <Upload
                        accept=".pdf,.doc,.docx"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleUploadNotes(file);
                            return false;
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            loading={uploadingNotes}
                            style={{ backgroundColor: "#4f46e5", height: "48px" }}
                            className="text-white font-semibold px-8"
                        >
                            Upload Notes
                        </Button>
                    </Upload>
                </div>
            </div>

            <style jsx>{`
                .delete-button:hover .anticon {
                    color: red;
                }
            `}</style>
        </div>
    );
}