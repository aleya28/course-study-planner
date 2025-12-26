import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { awsConfig } from './aws-config';
import './index.css';

// Configure AWS Amplify
Amplify.configure({
    Auth: {
        Cognito: {
            region: awsConfig.region,
            userPoolId: awsConfig.userPoolId,
            userPoolClientId: awsConfig.userPoolClientId
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
