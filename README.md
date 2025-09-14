# Video Downloader Browser Extension

A browser extension that adds download functionality to video and image album pages on boundhub.com. Available for both Firefox and Chrome. Firefox is recommended, Chrome is untested.

# Words to the wise

Should you trust an extension sideloaded from outside the extension store? **Absolutely the fuck not.** That is never a good idea unless you're absolutely sure what you're getting into. There could be any sort of malware or otherwise malicious code that someone has put in the extension. I've included jszip in this extension to be able to download albums as a single file, which comes as minified code which further obfuscates its functionality. If you don't know what you're doing, don't install a sideloaded extension.

That being said, the code here is open source for all eyes to see, and it's just a pretty minimal bit of DOM Manipulation (heh). If you're not a developer, you should do something like passing this extension along to an LLM to get it to verify the safety of the code.

# Usage

On a video, click the "Download Video" button in the tabs menu. It'll open the video URL in a second tab, start downloading, and close the second tab. There's no need to keep the original video tab open once the download has started.

On an album, click the "Download Album" button in the tabs menu. **You must keep the album tab open** once the download has started.

## Installation Methods

### Firefox Installation

#### Method 1: Install from XPI File (Recommended)

1. **Download the extension**:
   - Download `VideoDownloader-Firefox.xpi` from the releases (right hand side of the page)

2. **Install in Firefox**:
   - Open Firefox
   - Go to `about:addons`
   - Click the gear icon (⚙️) in the top-right corner
   - Select "Install Add-on From File..."
   - Choose the `VideoDownloader-Firefox.xpi` file
   - Click "Add" to install

3. **Verify installation**:
   - The extension should appear in your add-ons list
   - Visit a video or album page on boundhub.com
   - You should see a "Download Video" or "Download Album" button

#### Method 2: Temporary Installation (Developer Mode)

1. **Open Firefox Developer Tools**:
   - Go to `about:debugging`
   - Click "This Firefox" in the left sidebar

2. **Load the extension**:
   - Click "Load Temporary Add-on..."
   - Navigate to this folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Note**: This method requires reloading the extension after each Firefox restart

### Chrome Installation

#### Method 1: Install from ZIP File (Recommended)

1. **Download the extension**:
   - Download `VideoDownloader-Chrome.zip` from the releases tab (right hand side of the page)

2. **Extract the ZIP file**:
   - Extract `VideoDownloader-Chrome.zip` to a folder
   - You should have: `manifest-chrome.json`, `content-chrome.js`, `auto-download-chrome.js`, `jszip.min.js`, `styles.css`

3. **Install in Chrome**:
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the folder containing the extracted files
   - Click "Select Folder"

4. **Verify installation**:
   - The extension should appear in your extensions list
   - Visit a video or album page on boundhub.com
   - You should see a "Download Video" or "Download Album" button

#### Method 2: Create Chrome Extension Manually

If you want to create the Chrome extension yourself:

1. **Select Chrome extension files**:
   - `manifest-chrome.json` (rename to `manifest.json`)
   - `content-chrome.js` (rename to `content.js`)
   - `auto-download-chrome.js` (rename to `auto-download.js`)
   - `jszip.min.js`
   - `styles.css`

2. **Create a folder** and place all files in it

3. **Install as in Method 1**

## Usage

### Video Downloads
1. Navigate to a video page on boundhub.com (URL contains `/videos`)
2. Click the red "Download Video" button in the tabs menu
3. The video URL will open in a new tab
4. The video will automatically download and the tab will close

### Album Downloads
1. Navigate to an album page on boundhub.com (URL contains `/albums`)
2. Click the red "Download Album" button in the tabs menu
3. A progress indicator will show download progress
4. All images will be downloaded as a single ZIP file

## File Structure

```
VideoDownloader/
├── manifest.json                # Firefox extension configuration
├── manifest-chrome.json         # Chrome extension configuration (Manifest V3)
├── content.js                   # Firefox content script
├── content-chrome.js            # Chrome content script
├── auto-download.js             # Firefox auto-download script
├── auto-download-chrome.js      # Chrome auto-download script
├── jszip.min.js                 # JSZip library for creating ZIP files
├── styles.css                   # Button styling
├── VideoDownloader-Firefox.xpi  # Pre-built Firefox extension package
├── VideoDownloader-Chrome.zip   # Pre-built Chrome extension package
└── README.md                    # This file
```

## Technical Details

### Firefox Version
- **Manifest Version**: 2 (Firefox WebExtension)
- **Permissions**: activeTab, downloads, storage
- **Content Scripts**: 
  - Runs on boundhub.com for video/album pages
  - Runs on all URLs for MP4 auto-download
- **Dependencies**: JSZip 3.10.1 (included locally)

### Chrome Version
- **Manifest Version**: 3 (Chrome Extension)
- **Permissions**: activeTab, downloads, storage
- **Content Scripts**: 
  - Runs on boundhub.com for video/album pages
  - Runs on all URLs for MP4 auto-download
- **Dependencies**: JSZip 3.10.1 (included locally)
- **Web Accessible Resources**: JSZip library accessible to content scripts

### Development Notes

Rebundle for Chrome: `powershell -Command "Compress-Archive -Path 'manifest-chrome.json', 'content-chrome.js', 'auto-download-chrome.js', 'jszip.min.js', 'styles.css' -DestinationPath 'VideoDownloader-Chrome.zip' -Force"`

Rebundle for Firefox: `powershell -Command "Compress-Archive -Path 'manifest.json', 'content.js', 'auto-download.js', 'jszip.min.js', 'styles.css' -DestinationPath 'VideoDownloader-Firefox.zip' -Force ; del VideoDownloader-Firefox.xpi ; ren VideoDownloader-Firefox.zip VideoDownloader-Firefox.xpi"`