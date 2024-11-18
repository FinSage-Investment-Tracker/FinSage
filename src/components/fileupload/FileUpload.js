import React, { useContext, useState } from 'react';
import { StockContext } from '../../context/StockContext';
import { useParams } from 'react-router-dom';

const FileUpload = () => {
    const { portfolioId } = useParams();
    const [file, setFile] = useState(null);
    const { uploadFile } = useContext(StockContext);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            await uploadFile(portfolioId, file);
        } else {
            console.error('Please select a file before uploading');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="fileInput" className="form-label">
                                        Select File:
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="fileInput"
                                        onChange={handleFileChange}
                                        accept=".xlsx"
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
