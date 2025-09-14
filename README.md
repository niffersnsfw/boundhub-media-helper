# Trust and safety

Should you trust an extension sideloaded from outside a browser's extension store? **Absolutely the fuck not!** That is never a good idea unless you're sure what you're getting. There could be any sort of malware or otherwise malicious code that I've put in the extension. I've also included a third party library (JSZip) in this extension to be able to download albums as a single file; that comes as minified code which - though legitimate for performance - obfuscates its functionality if you don't know what it's for, or my use case for it. **If you cannot trust the provider of the code, don't install a sideloaded extension**.

That being said, the code here is open source for all eyes to see, and it's just a pretty minimal bit of DOM Manipulation (heh). You can check the version of JSZip I've included with the official source to verify the checksums match. **If you're not a developer, you should do something like passing my extension along to ChatGPT / an LLM to get it to verify the safety of the code.** 

There is nothing malicious here, but you should still heed my warning for this and anything else.

# Usage

On a video, click the "Download Video" button in the tabs menu. It'll open the video URL in a second tab, start downloading, and close the second tab. There's no need to keep the original video tab open once the download has started.

On an album, click the "Download Album" button in the tabs menu. **You must keep the album tab open** once the download has started.

# Installation

### For Firefox Users (**RECOMMENDED**)

1. **Download** [`VideoDownloader-Firefox.xpi` from this repository](https://github.com/niffersnsfw/boundhub-media-helper/releases/download/v1.0.0/VideoDownloader-Firefox.xpi)
2. **Open Firefox** and go to `about:addons`
3. **Click the gear icon** (⚙️) in the top-right corner
4. **Select "Install Add-on From File..."**
5. **Choose** the `VideoDownloader-Firefox.xpi` file
6. **Click "Add"** to install
7. **Done!** Visit boundhub.com to use the extension

### For Chrome Users (**NOT** recommended, minimally tested)

1. **Download** [`VideoDownloader-Chrome.zip` from this repository](https://github.com/niffersnsfw/boundhub-media-helper/releases/download/v1.0.0/VideoDownloader-Chrome.zip)
2. **Extract** the ZIP file to any folder on your computer
3. **Open Chrome** and go to `chrome://extensions/`
4. **Enable "Developer mode"** (toggle in top-right corner)
5. **Click "Load unpacked"**
6. **Select** the folder you extracted the files to
7. **Done!** Visit boundhub.com to use the extension

## How to Use

### Download Videos
1. Go to any video page on boundhub.com (URL contains `/videos` and page contains a video player)
2. Click the **"Download Video"** button in the tabs menu
3. The video will open in a second tab and start the download automatically; the second tab will close itself once the download has started
4. Once the download has started, you can close the original video tab

### Download Image Albums
1. Go to any album page on boundhub.com (URL contains `/albums`)
2. Click the **"Download Album"** button in the tabs menu
3. There will be a progress indicator as it downloads all images; you **must keep the album tab open** once the download has started
4. All images will be saved as a single ZIP file

---

## Stuff for nerds

### File Structure
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

### Technical Details

#### Firefox Version
- **Manifest Version**: 2 (Firefox WebExtension)
- **Permissions**: activeTab, downloads, storage
- **Content Scripts**: 
  - Runs on boundhub.com for video/album pages
  - Runs on all URLs for MP4 auto-download
- **Dependencies**: JSZip 3.10.1 (included locally)

#### Chrome Version
- **Manifest Version**: 3 (Chrome Extension)
- **Permissions**: activeTab, downloads, storage
- **Content Scripts**: 
  - Runs on boundhub.com for video/album pages
  - Runs on all URLs for MP4 auto-download
- **Dependencies**: JSZip 3.10.1 (included locally)

### Building from Source

#### Firefox Development
1. **Edit** the Firefox source files (`manifest.json`, `content.js`, `auto-download.js`)
2. **Test** with temporary installation:
   - Go to `about:debugging` → "This Firefox"
   - Click "Load Temporary Add-on..."
   - Select `manifest.json`
3. **Create XPI** when ready:
   - Select all files: `manifest.json`, `content.js`, `auto-download.js`, `jszip.min.js`, `styles.css`
   - Create ZIP archive
   - Rename to `.xpi`

#### Chrome Development
1. **Edit** the Chrome source files (`manifest-chrome.json`, `content-chrome.js`, `auto-download-chrome.js`)
2. **Test** with unpacked installation:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the folder with your files
3. **Create ZIP** when ready:
   - Select all files: `manifest-chrome.json`, `content-chrome.js`, `auto-download-chrome.js`, `jszip.min.js`, `styles.css`
   - Create ZIP archive

### Cross-Browser Development
- Both versions share the same `jszip.min.js` and `styles.css` files
- Chrome uses Manifest V3, Firefox uses Manifest V2
- Chrome requires `web_accessible_resources` for JSZip
- Both versions have identical functionality

Rebundle for Chrome: `powershell -Command "Compress-Archive -Path 'manifest-chrome.json', 'content-chrome.js', 'auto-download-chrome.js', 'jszip.min.js', 'styles.css' -DestinationPath 'VideoDownloader-Chrome.zip' -Force"`

Rebundle for Firefox: `powershell -Command "Compress-Archive -Path 'manifest.json', 'content.js', 'auto-download.js', 'jszip.min.js', 'styles.css' -DestinationPath 'VideoDownloader-Firefox.zip' -Force ; del VideoDownloader-Firefox.xpi ; ren VideoDownloader-Firefox.zip VideoDownloader-Firefox.xpi"`

## License

This extension is for personal use only. Please respect the terms of service of the websites you use it on.

