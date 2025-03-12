// src/components/ModelGenerator.js
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import './ModelGenerator.css';

const API_BASE_URL = 'http://localhost:3001/api';

const Model = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
};

const ModelGenerator = () => {
  const [textPrompt, setTextPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [generationType, setGenerationType] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Generate 3D model from text
  const generateFromText = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/generate-from-text`, {
        prompt: textPrompt
      });
      
      setTaskId(response.data.taskId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate model from text');
      setIsLoading(false);
    }
  };

  // Generate 3D model from image
  const generateFromImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', imageFile);
      if (textPrompt) {
        formData.append('prompt', textPrompt);
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate-from-image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setTaskId(response.data.taskId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate model from image');
      setIsLoading(false);
    }
  };

  // Check task status
  useEffect(() => {
    let intervalId;
    
    if (taskId) {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/check-status/${taskId}`);
          setTaskStatus(response.data.status);
          
          if (response.data.status === 'completed') {
            setModelUrl(response.data.resultUrl);
            setIsLoading(false);
            clearInterval(intervalId);
          } else if (response.data.status === 'failed') {
            setError('Model generation failed');
            setIsLoading(false);
            clearInterval(intervalId);
          }
        } catch (err) {
          setError('Failed to check task status');
          setIsLoading(false);
          clearInterval(intervalId);
        }
      }, 3000); // Check every 3 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId]);

  const handleGenerate = () => {
    if (generationType === 'text') {
      generateFromText();
    } else {
      generateFromImage();
    }
  };

  return (
    <div className="model-generator">
      <div className="control-panel">
        <h2>3D Model Generator</h2>
        
        <div className="generation-type">
          <label>
            <input 
              type="radio" 
              value="text" 
              checked={generationType === 'text'} 
              onChange={() => setGenerationType('text')} 
            />
            Generate from Text
          </label>
          <label>
            <input 
              type="radio" 
              value="image" 
              checked={generationType === 'image'} 
              onChange={() => setGenerationType('image')} 
            />
            Generate from Image
          </label>
        </div>
        
        <div className="input-section">
          <label>
            Description:
            <textarea 
              value={textPrompt} 
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Enter a detailed description of the parking spot..."
            />
          </label>
          
          {generationType === 'image' && (
            <div className="image-upload">
              <label>
                Upload Image:
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={handleGenerate} 
            disabled={isLoading || (generationType === 'text' && !textPrompt) || (generationType === 'image' && !imageFile)}
          >
            {isLoading ? 'Generating...' : 'Generate 3D Model'}
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        {taskStatus && (
          <div className="status">
            Status: {taskStatus}
            {taskStatus === 'processing' && <div className="loader"></div>}
          </div>
        )}
      </div>
      
      <div className="model-viewer">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          {modelUrl && <Model modelUrl={modelUrl} />}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default ModelGenerator;