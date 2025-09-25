(function() {
    'use strict';
    
    let downloadButton = null;
    let isVideoLoaded = false;
    let videoSrc = null;
    
    function createDownloadButton(buttonText = 'Download') {
        if (document.getElementById('video-downloader-btn')) {
            return;
        }
        
        const tabsMenu = document.querySelector('.tabs-menu ul');
        if (!tabsMenu) {
            console.log('Video Downloader: Tabs menu not found, retrying...');
            setTimeout(() => createDownloadButton(buttonText), 1000);
            return;
        }
        
        const downloadBtn = document.createElement('li');
        downloadBtn.id = 'video-downloader-btn';
        downloadBtn.innerHTML = `<a href="#" class="toggle-button download-button">${buttonText}</a>`;
        
        tabsMenu.insertBefore(downloadBtn, tabsMenu.firstChild);
        
        const anchor = downloadBtn.querySelector('a');
        anchor.addEventListener('click', handleDownloadClick);
        
        downloadButton = downloadBtn;
        console.log('Video Downloader: Download button added');
    }
    
    async function handleDownloadClick(event) {
        event.preventDefault();
        
        try {
            if (isVideoPage()) {
                await handleVideoDownload();
            } else if (isAlbumPage()) {
                await handleAlbumDownload();
            }
        } catch (error) {
            console.error('Video Downloader Error:', error);
            alert('Download failed: ' + error.message);
        }
    }
    
    async function handleVideoDownload() {
        await loadVideo();
        
        const titleElement = document.querySelector('.headline');
        const title = titleElement ? titleElement.innerText.trim() : 'video';
        
        const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
        
        const video = document.querySelector('video');
        if (!video || !video.src) {
            throw new Error('Video source not found. Make sure the video is loaded first.');
        }
        
        await downloadVideo(video.src, cleanTitle);
    }
    
    async function handleAlbumDownload() {
        const titleElement = document.querySelector('.headline');
        const title = titleElement ? titleElement.innerText.trim() : 'album';
        const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
        
        const imagesContainer = document.querySelector('.images');
        if (!imagesContainer) {
            throw new Error('Images container not found');
        }
        
        const imageUrls = [...imagesContainer.children].map(child => child.href).filter(href => href);
        
        if (imageUrls.length === 0) {
            throw new Error('No images found in album');
        }
        
        console.log(`Video Downloader: Found ${imageUrls.length} images in album`);
        
        await downloadAlbumAsZip(imageUrls, cleanTitle);
    }
    
    async function loadVideo() {
        if (isVideoLoaded) {
            return;
        }
        
        const fpUiElement = document.querySelector('.fp-ui');
        if (fpUiElement) {
            fpUiElement.click();
            console.log('Video Downloader: Clicked fp-ui element');
            
            await waitForVideo();
            isVideoLoaded = true;
        } else {
            throw new Error('Video player not found. Make sure you are on a video page.');
        }
    }
    
    function waitForVideo() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Video did not load within 10 seconds'));
            }, 10000);
            
            const checkVideo = () => {
                const video = document.querySelector('video');
                if (video && video.src) {
                    clearTimeout(timeout);
                    videoSrc = video.src;
                    console.log('Video Downloader: Video loaded successfully');
                    resolve();
                } else {
                    setTimeout(checkVideo, 500);
                }
            };
            
            checkVideo();
        });
    }
    
    async function downloadVideo(url, filename) {
        try {
            console.log('Video Downloader: Opening video URL...');
            console.log('Video Downloader: URL:', url);
            console.log('Video Downloader: Filename:', filename);
            
            if (!url || url === '') {
                throw new Error('Video URL is empty or invalid');
            }
            
            if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('blob:')) {
                throw new Error('Video URL is not a valid HTTP/HTTPS/blob URL: ' + url);
            }
            
            console.log('Video Downloader: Opening video URL in new tab...');
            window.open(url, '_blank');
            
            console.log('Video Downloader: Video URL opened successfully');
            
        } catch (error) {
            console.error('Video Downloader: Error opening video URL:', {
                error: error,
                message: error.message,
                name: error.name,
                stack: error.stack,
                url: url,
                filename: filename
            });
            throw new Error('Failed to open video URL: ' + error.message);
        }
    }
    
    async function downloadAlbumAsZip(imageUrls, albumTitle) {
        try {
            console.log('Video Downloader: Starting album download...');
            console.log('Video Downloader: Album title:', albumTitle);
            console.log('Video Downloader: Image count:', imageUrls.length);
            
            if (typeof JSZip === 'undefined') {
                throw new Error('JSZip library is not available. Please reload the extension.');
            }
            
            console.log('Video Downloader: JSZip library ready, creating ZIP...');
            const zip = new JSZip();
            let downloadedCount = 0;
            
            const progressDiv = document.createElement('div');
            progressDiv.id = 'download-progress';
            progressDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;
            progressDiv.innerHTML = `Downloading album... 0/${imageUrls.length}`;
            document.body.appendChild(progressDiv);
            
            for (let i = 0; i < imageUrls.length; i++) {
                try {
                    const imageUrl = imageUrls[i];
                    console.log(`Video Downloader: Downloading image ${i + 1}/${imageUrls.length}: ${imageUrl}`);
                    
                    const response = await fetch(imageUrl, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'omit',
                        headers: {
                            'Accept': 'image/*'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    const blob = await response.blob();
                    console.log(`Video Downloader: Image ${i + 1} blob size: ${blob.size} bytes, type: ${blob.type}`);
                    
                    // Get file extension from URL or content type
                    let extension = '.jpg';
                    if (imageUrl.includes('.png')) extension = '.png';
                    else if (imageUrl.includes('.gif')) extension = '.gif';
                    else if (imageUrl.includes('.webp')) extension = '.webp';
                    else if (blob.type.includes('png')) extension = '.png';
                    else if (blob.type.includes('gif')) extension = '.gif';
                    else if (blob.type.includes('webp')) extension = '.webp';
                    
                    const filename = `image_${String(i + 1).padStart(3, '0')}${extension}`;
                    
                    // Convert blob to ArrayBuffer for JSZip
                    const arrayBuffer = await blob.arrayBuffer();
                    zip.file(filename, arrayBuffer);
                    
                    downloadedCount++;
                    progressDiv.innerHTML = `Downloading album... ${downloadedCount}/${imageUrls.length}`;
                    console.log(`Video Downloader: Added ${filename} to ZIP`);
                    
                } catch (error) {
                    console.warn(`Failed to download image ${i + 1}:`, error);
                }
            }
            
            progressDiv.innerHTML = 'Creating ZIP file...';
            const zipBlob = await zip.generateAsync({type: 'blob'});
            
            const downloadUrl = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${albumTitle}.zip`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
            
            document.body.removeChild(progressDiv);
            
            console.log('Video Downloader: Album download completed');
            
        } catch (error) {
            console.error('Video Downloader: Album download failed:', error);
            throw new Error('Failed to download album: ' + error.message);
        }
    }
    
    function isVideoPage() {
        return document.querySelector('.tabs-menu') !== null && window.location.pathname.includes('/videos');
    }
    
    function isAlbumPage() {
        return document.querySelector('.images') !== null && window.location.pathname.includes('/albums');
    }
    
    function isCorrectDomain() {
        const hostname = window.location.hostname;
        return hostname.includes('boundhub.com') || hostname.includes('www.boundhub.com');
    }
    
    function isSupportedPage() {
        return isVideoPage() || isAlbumPage();
    }
    
    function init() {
        if (isCorrectDomain() && isSupportedPage()) {
            if (isVideoPage()) {
                console.log('Video Downloader: Video page detected on correct domain');
                createDownloadButton('Download Video');
            } else if (isAlbumPage()) {
                console.log('Video Downloader: Album page detected on correct domain');
                createDownloadButton('Download Album');
            }
        } else if (!isCorrectDomain()) {
            console.log('Video Downloader: Not on correct domain, skipping');
        } else {
            console.log('Video Downloader: Not a supported page type, skipping');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                if (isCorrectDomain() && isSupportedPage() && !downloadButton) {
                    if (isVideoPage()) {
                        createDownloadButton('Download Video');
                    } else if (isAlbumPage()) {
                        createDownloadButton('Download Album');
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
