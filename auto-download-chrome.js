// Auto-download script for MP4 URLs - Chrome Version
(function() {
    'use strict';
    
    console.log('Video Downloader: Auto-download script loaded for MP4 URL');
    
    // Check if we're on an MP4 URL
    function isMp4Url() {
        const url = window.location.href;
        return url.includes('.mp4') || url.endsWith('.mp4');
    }
    
    // Function to extract filename from URL
    function getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            
            // If no filename or it's just the domain, create a default name
            if (!filename || filename === '' || !filename.includes('.')) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                return `video-${timestamp}.mp4`;
            }
            
            return filename;
        } catch (error) {
            console.error('Video Downloader: Error parsing URL:', error);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            return `video-${timestamp}.mp4`;
        }
    }
    
    // Function to auto-download the MP4
    async function autoDownload() {
        try {
            const url = window.location.href;
            const filename = getFilenameFromUrl(url);
            
            console.log('Video Downloader: Auto-downloading MP4...');
            console.log('Video Downloader: URL:', url);
            console.log('Video Downloader: Filename:', filename);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            // Add to document and click
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            console.log('Video Downloader: Auto-download started for', filename);
            
            // Close the tab after a short delay
            setTimeout(() => {
                if (window.history.length > 1) {
                    window.close();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Video Downloader: Auto-download failed:', error);
        }
    }
    
    // Run auto-download if we're on an MP4 URL
    if (isMp4Url()) {
        console.log('Video Downloader: MP4 URL detected, starting auto-download...');
        
        // Wait a bit for the page to load, then start download
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoDownload);
        } else {
            // Page already loaded, start download immediately
            setTimeout(autoDownload, 500);
        }
    }
    
})();
