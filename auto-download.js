// Auto-download script for MP4 URLs
(function() {
    'use strict';
    
    console.log('Video Downloader: Auto-download script loaded for MP4 URL');
    
    function isMp4Url() {
        const url = window.location.href;
        return url.includes('.mp4') || url.endsWith('.mp4');
    }
    
    function getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            
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
    
    async function autoDownload() {
        try {
            const url = window.location.href;
            const filename = getFilenameFromUrl(url);
            
            console.log('Video Downloader: Auto-downloading MP4...');
            console.log('Video Downloader: URL:', url);
            console.log('Video Downloader: Filename:', filename);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            console.log('Video Downloader: Auto-download started for', filename);
            
            setTimeout(() => {
                console.log('Video Downloader: Closing MP4 tab...');
                window.close();
            }, 1500);
            
        } catch (error) {
            console.error('Video Downloader: Auto-download failed:', error);
        }
    }
    
    if (isMp4Url()) {
        console.log('Video Downloader: MP4 URL detected, starting auto-download...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoDownload);
        } else {
            setTimeout(autoDownload, 500);
        }
    }

})();
