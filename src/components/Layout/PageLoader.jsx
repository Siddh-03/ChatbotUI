import React from 'react';

const PageLoader = ({ showLoader }) => {
  if (!showLoader) return null;
  
  return (
    <div className="dash-professional-page-loader dash-visible">
      <div className="dash-loader-logo-container">
        {/* Set your company logo path here */}
        <div className="dash-loader-logo-placeholder">
             <img src="/assist/images/ybai.png" alt="Loading..." />
        </div>
      </div>
      <p className="dash-loader-text">Initializing AgentVerse...</p>
    </div>
  );
};

export default PageLoader;