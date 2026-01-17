(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TestimonialWidget"] = factory();
	else
		root["TestimonialWidget"] = factory();
})(Object(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this), () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

/**
 * Testimonial SaaS - Injectable Script
 * This script can be injected into any website to enable testimonial collection
 */
// Store the class outside the IIFE so it persists after UMD wrapper executes
let TestimonialWidgetClass;
(function () {
    'use strict';
    class TestimonialWidget {
        constructor(siteId, apiUrl) {
            this.config = null;
            this.shadowRoot = null;
            this.siteId = siteId;
            this.apiUrl = apiUrl || this.detectApiUrl();
            this.sessionId = this.generateSessionId();
            this.init();
        }
        detectApiUrl() {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const src = scripts[i].src;
                if (src.includes('script.js')) {
                    // Handle both /script.js and /api/script.js
                    return src.replace(/\/api\/script\.js$/, '').replace(/\/script\.js$/, '');
                }
            }
            return window.location.origin;
        }
        generateSessionId() {
            return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        async init() {
            try {
                await this.loadConfig();
                // Default to true if enabled is not explicitly set to false
                const buttonEnabled = this.config?.button?.enabled !== false;
                if (this.config && buttonEnabled) {
                    this.injectButton();
                    this.trackEvent('button_view');
                }
                else {
                    console.log('Button not injected. Config:', this.config ? {
                        hasConfig: true,
                        buttonEnabled: this.config.button?.enabled,
                        button: this.config.button
                    } : { hasConfig: false });
                }
            }
            catch (error) {
                console.error('Failed to initialize testimonial widget:', error);
            }
        }
        async loadConfig() {
            try {
                const configUrl = `${this.apiUrl}/api/config/${this.siteId}`;
                console.log('Loading config from:', configUrl);
                const response = await fetch(configUrl);
                if (!response.ok) {
                    console.error(`Failed to load configuration: ${response.status} ${response.statusText}`);
                    console.error('Config URL:', configUrl);
                    throw new Error(`Failed to load configuration: ${response.status}`);
                }
                this.config = await response.json();
                console.log('Config loaded successfully:', this.config);
            }
            catch (error) {
                console.error('Failed to load configuration:', error);
                console.error('API URL:', this.apiUrl);
                console.error('Site ID:', this.siteId);
            }
        }
        injectButton() {
            if (!this.config) {
                console.error('Config not available in injectButton');
                return;
            }
            console.log('Injecting button...');
            // Create shadow DOM container
            const container = document.createElement('div');
            container.id = 'testimonial-widget-container';
            document.body.appendChild(container);
            console.log('Button container created and appended to body');
            this.shadowRoot = container.attachShadow({ mode: 'closed' });
            console.log('Shadow root created');
            const button = this.createButton();
            this.shadowRoot.appendChild(button);
            console.log('Button appended to shadow root');
        }
        createButton() {
            if (!this.config)
                throw new Error('Config not loaded');
            const button = document.createElement('button');
            button.textContent = this.config.button.text;
            button.id = 'testimonial-button';
            // Apply styles
            const styles = this.getButtonStyles();
            button.setAttribute('style', styles);
            // Add click handler
            button.addEventListener('click', (e) => {
                console.log('Button clicked! Event:', e);
                e.stopPropagation();
                this.trackEvent('button_click');
                console.log('Opening testimonial flow...');
                this.openTestimonialFlow();
            });
            console.log('Button click handler attached');
            return button;
        }
        getButtonStyles() {
            if (!this.config)
                return '';
            const { button, theme } = this.config;
            const sizeMap = { small: '40px', medium: '50px', large: '60px' };
            const borderRadiusMap = { rounded: '8px', square: '0', pill: '50px' };
            return `
        position: fixed;
        ${button.position === 'bottom-right' ? 'bottom: 20px; right: 20px;' : ''}
        ${button.position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : ''}
        ${button.position === 'top-right' ? 'top: 20px; right: 20px;' : ''}
        ${button.position === 'top-left' ? 'top: 20px; left: 20px;' : ''}
        background-color: ${button.backgroundColor};
        color: ${button.textColor};
        border: none;
        padding: 12px 24px;
        font-size: 16px;
        font-family: ${theme.fontFamily};
        border-radius: ${borderRadiusMap[button.shape]};
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 999999;
        transition: transform 0.2s, box-shadow 0.2s;
      `;
        }
        async openTestimonialFlow() {
            console.log('openTestimonialFlow called, config:', this.config);
            if (!this.config) {
                console.error('Config not available in openTestimonialFlow');
                return;
            }
            console.log('Flow type:', this.config.flowType);
            switch (this.config.flowType) {
                case 'modal':
                    console.log('Opening modal');
                    this.openModal();
                    break;
                case 'drawer':
                    console.log('Opening drawer');
                    this.openDrawer();
                    break;
                case 'page':
                    console.log('Opening page');
                    this.openPage();
                    break;
                default:
                    console.log('Unknown flow type, defaulting to modal');
                    this.openModal();
            }
        }
        openModal() {
            const modal = document.createElement('div');
            modal.id = 'testimonial-modal';
            modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 1000000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
      `;
            // Add fade-in animation
            const style = document.createElement('style');
            style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
            document.head.appendChild(style);
            const content = this.createTestimonialContent();
            modal.appendChild(content);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            document.body.appendChild(modal);
        }
        openDrawer() {
            const drawer = document.createElement('div');
            drawer.id = 'testimonial-drawer';
            drawer.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        max-width: 90vw;
        height: 100vh;
        background-color: white;
        z-index: 1000000;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
      `;
            const content = this.createTestimonialContent();
            drawer.appendChild(content);
            document.body.appendChild(drawer);
        }
        openPage() {
            const iframe = document.createElement('iframe');
            // Testimonial form route is excluded from /api prefix for public access
            const pageUrl = `${this.apiUrl}/testimonial-form/${this.siteId}`;
            console.log('Opening testimonial page:', pageUrl);
            iframe.src = pageUrl;
            // Grant camera and microphone permissions to the iframe
            iframe.setAttribute('allow', 'camera; microphone; autoplay');
            iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        z-index: 1000000;
      `;
            iframe.onerror = (error) => {
                console.error('Failed to load testimonial page:', error);
                console.error('Page URL:', pageUrl);
            };
            document.body.appendChild(iframe);
        }
        createTestimonialContent() {
            if (!this.config)
                throw new Error('Config not loaded');
            const primaryColor = this.config?.theme?.primaryColor || '#667eea';
            const borderRadius = this.config?.theme?.borderRadius || '16px';
            const container = document.createElement('div');
            container.style.cssText = `
        background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
        padding: 0;
        border-radius: ${borderRadius};
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
        animation: slideUp 0.4s ease-out;
        display: flex;
        flex-direction: column;
      `;
            // Header with gradient
            const header = document.createElement('div');
            header.style.cssText = `
        background: linear-gradient(135deg, ${primaryColor} 0%, ${this.config?.theme?.secondaryColor || '#764ba2'} 100%);
        padding: 32px;
        color: white;
        position: relative;
      `;
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '✕';
            closeButton.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-weight: 300;
      `;
            closeButton.onmouseover = () => {
                closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
                closeButton.style.transform = 'scale(1.1)';
            };
            closeButton.onmouseout = () => {
                closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
                closeButton.style.transform = 'scale(1)';
            };
            closeButton.onclick = () => {
                const modal = document.getElementById('testimonial-modal');
                const drawer = document.getElementById('testimonial-drawer');
                if (modal)
                    document.body.removeChild(modal);
                if (drawer)
                    document.body.removeChild(drawer);
            };
            header.appendChild(closeButton);
            const title = document.createElement('h2');
            title.textContent = 'Share Your Testimonial';
            title.style.cssText = `
        color: white;
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      `;
            header.appendChild(title);
            const subtitle = document.createElement('p');
            subtitle.textContent = 'We\'d love to hear about your experience!';
            subtitle.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        margin: 8px 0 0 0;
        font-size: 16px;
        font-weight: 400;
      `;
            header.appendChild(subtitle);
            container.appendChild(header);
            // Content area
            const contentArea = document.createElement('div');
            contentArea.style.cssText = `
        padding: 32px;
        overflow-y: auto;
        flex: 1;
      `;
            const formContainer = document.createElement('div');
            formContainer.id = 'testimonial-form-container';
            contentArea.appendChild(formContainer);
            container.appendChild(contentArea);
            // Check how many features are enabled
            // Default to true if not explicitly set to false
            const hasVideo = this.config.enabledFeatures?.videoTestimonial !== false;
            const hasText = this.config.enabledFeatures?.textTestimonial !== false;
            const bothEnabled = hasVideo && hasText;
            if (bothEnabled) {
                // Show selection buttons only if both are enabled
                const typeSelector = document.createElement('div');
                typeSelector.style.cssText = 'display: flex; gap: 16px; margin-bottom: 32px;';
                const videoButton = this.createTypeButton('Video Testimonial', 'video');
                typeSelector.appendChild(videoButton);
                const textButton = this.createTypeButton('Text Testimonial', 'text');
                typeSelector.appendChild(textButton);
                contentArea.insertBefore(typeSelector, formContainer);
            }
            else {
                // If only one is enabled, show that form directly
                // Pass the container directly to avoid DOM lookup issues
                console.log('Only one testimonial type enabled. hasVideo:', hasVideo, 'hasText:', hasText);
                if (hasVideo) {
                    console.log('Showing video form directly, formContainer:', formContainer);
                    // Ensure container is visible and has proper styling
                    formContainer.style.display = 'block';
                    formContainer.style.minHeight = '200px';
                    // Use setTimeout with a small delay to ensure DOM is ready
                    setTimeout(() => {
                        console.log('Clearing container and showing video form');
                        formContainer.innerHTML = '';
                        this.showVideoForm(formContainer);
                    }, 50);
                }
                else if (hasText) {
                    console.log('Showing text form directly, formContainer:', formContainer);
                    // Ensure container is visible and has proper styling
                    formContainer.style.display = 'block';
                    formContainer.style.minHeight = '200px';
                    // Use setTimeout with a small delay to ensure DOM is ready
                    setTimeout(() => {
                        console.log('Clearing container and showing text form');
                        formContainer.innerHTML = '';
                        this.showTextForm(formContainer);
                    }, 50);
                }
                else {
                    // Neither enabled - show message
                    const message = document.createElement('p');
                    message.textContent = 'Testimonial submission is currently unavailable. Please enable at least one testimonial type in your dashboard settings.';
                    message.style.cssText = 'color: #666; text-align: center; padding: 20px;';
                    formContainer.appendChild(message);
                    console.warn('Both videoTestimonial and textTestimonial are disabled. Enable at least one in dashboard.');
                }
            }
            return container;
        }
        createTypeButton(label, type) {
            if (!this.config)
                throw new Error('Config not loaded');
            const button = document.createElement('button');
            button.textContent = label;
            button.style.cssText = `
        flex: 1;
        padding: 16px;
            background-color: ${this.config?.theme?.primaryColor || '#007bff'};
        color: white;
        border: none;
        border-radius: ${this.config?.theme?.borderRadius || '8px'};
        cursor: pointer;
        font-size: 16px;
      `;
            button.onclick = () => {
                this.trackEvent('testimonial_type_selected', { testimonialType: type });
                this.showForm(type);
            };
            return button;
        }
        showForm(type) {
            console.log('showForm called with type:', type);
            const container = document.getElementById('testimonial-form-container');
            if (!container) {
                console.error('Testimonial form container not found. Retrying...');
                // Retry multiple times with increasing delays
                let retries = 0;
                const maxRetries = 5;
                const retryInterval = setInterval(() => {
                    retries++;
                    const retryContainer = document.getElementById('testimonial-form-container');
                    if (retryContainer) {
                        console.log('Container found on retry', retries);
                        clearInterval(retryInterval);
                        retryContainer.innerHTML = '';
                        if (type === 'video') {
                            this.showVideoForm(retryContainer);
                        }
                        else {
                            this.showTextForm(retryContainer);
                        }
                    }
                    else if (retries >= maxRetries) {
                        console.error('Testimonial form container not found after', maxRetries, 'retries');
                        clearInterval(retryInterval);
                    }
                }, 50);
                return;
            }
            console.log('Container found, showing form');
            container.innerHTML = '';
            if (type === 'video') {
                this.showVideoForm(container);
            }
            else {
                this.showTextForm(container);
            }
        }
        showVideoForm(container) {
            console.log('showVideoForm called, container:', container);
            if (!this.config) {
                console.error('Config not available in showVideoForm');
                return;
            }
            console.log('Creating video form container');
            const videoContainer = document.createElement('div');
            videoContainer.innerHTML = `
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Recording Type:</label>
          <div style="display: flex; gap: 12px;">
            <button id="webcam-btn" style="flex: 1; padding: 12px; background-color: ${this.config?.theme?.primaryColor || '#007bff'}; color: white; border: none; border-radius: ${this.config?.theme?.borderRadius || '8px'}; cursor: pointer; font-size: 14px;">📹 Webcam</button>
            <button id="screen-btn" style="flex: 1; padding: 12px; background-color: #6c757d; color: white; border: none; border-radius: ${this.config?.theme?.borderRadius || '8px'}; cursor: pointer; font-size: 14px;">🖥️ Screen</button>
          </div>
        </div>
        <video id="testimonial-video-preview" style="width: 100%; max-width: 100%; border-radius: 8px; margin-bottom: 16px; display: none;" autoplay muted></video>
        <div id="screen-preview" style="width: 100%; max-width: 100%; border-radius: 8px; margin-bottom: 16px; display: none; background: #000; min-height: 300px; position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center;">
            <p>Screen recording will start when you click "Start Recording"</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button id="record-btn" style="flex: 1; padding: 12px; background-color: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer;">Start Recording</button>
          <button id="stop-btn" style="flex: 1; padding: 12px; background-color: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;" disabled>Stop</button>
        </div>
        <video id="testimonial-video-recorded" style="width: 100%; max-width: 100%; border-radius: 8px; margin-bottom: 16px; display: none;" controls></video>
      `;
            container.appendChild(videoContainer);
            const webcamBtn = videoContainer.querySelector('#webcam-btn');
            const screenBtn = videoContainer.querySelector('#screen-btn');
            const recordBtn = videoContainer.querySelector('#record-btn');
            const stopBtn = videoContainer.querySelector('#stop-btn');
            const preview = videoContainer.querySelector('#testimonial-video-preview');
            const screenPreview = videoContainer.querySelector('#screen-preview');
            const recorded = videoContainer.querySelector('#testimonial-video-recorded');
            let mediaRecorder;
            let recordedChunks = [];
            let currentStream = null;
            let recordingType = 'webcam';
            // Set default to webcam
            webcamBtn.style.backgroundColor = this.config?.theme?.primaryColor || '#007bff';
            screenBtn.style.backgroundColor = '#6c757d';
            preview.style.display = 'block';
            screenPreview.style.display = 'none';
            webcamBtn.addEventListener('click', () => {
                recordingType = 'webcam';
                webcamBtn.style.backgroundColor = this.config.theme.primaryColor;
                screenBtn.style.backgroundColor = '#6c757d';
                preview.style.display = 'block';
                screenPreview.style.display = 'none';
            });
            screenBtn.addEventListener('click', () => {
                recordingType = 'screen';
                screenBtn.style.backgroundColor = this.config?.theme?.primaryColor || '#007bff';
                webcamBtn.style.backgroundColor = '#6c757d';
                preview.style.display = 'none';
                screenPreview.style.display = 'block';
            });
            recordBtn.addEventListener('click', async () => {
                try {
                    // Check if mediaDevices API is available
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                        if (!isSecure) {
                            alert('Camera access requires HTTPS. Please access this page over HTTPS or use localhost.');
                            return;
                        }
                        alert('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.');
                        return;
                    }
                    let stream;
                    if (recordingType === 'screen') {
                        // Screen recording
                        if (!navigator.mediaDevices.getDisplayMedia) {
                            alert('Screen recording is not supported in your browser.');
                            return;
                        }
                        stream = await navigator.mediaDevices.getDisplayMedia({
                            video: {
                                displaySurface: 'browser'
                            },
                            audio: true
                        });
                        preview.srcObject = stream;
                        preview.style.display = 'block';
                        screenPreview.style.display = 'none';
                        this.trackEvent('screen_recording_started');
                    }
                    else {
                        // Webcam recording
                        try {
                            stream = await navigator.mediaDevices.getUserMedia({
                                video: {
                                    facingMode: 'user',
                                    width: { ideal: 1280 },
                                    height: { ideal: 720 }
                                },
                                audio: true
                            });
                        }
                        catch (getUserMediaError) {
                            // Try with simpler constraints if the first attempt fails
                            console.warn('Failed with ideal constraints, trying basic constraints:', getUserMediaError);
                            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        }
                        preview.srcObject = stream;
                        preview.style.display = 'block';
                        screenPreview.style.display = 'none';
                        this.trackEvent('video_recording_started');
                    }
                    currentStream = stream;
                    // Check if MediaRecorder is supported
                    if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
                        console.warn('VP9 codec not supported, trying default codec');
                    }
                    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                        ? 'video/webm;codecs=vp9,opus'
                        : MediaRecorder.isTypeSupported('video/webm')
                            ? 'video/webm'
                            : '';
                    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
                    recordedChunks = [];
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            recordedChunks.push(e.data);
                        }
                    };
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        recorded.src = URL.createObjectURL(blob);
                        recorded.style.display = 'block';
                        preview.style.display = 'none';
                        screenPreview.style.display = 'none';
                        if (currentStream) {
                            currentStream.getTracks().forEach((track) => track.stop());
                            currentStream = null;
                        }
                    };
                    // Handle when user stops sharing screen
                    if (stream.getVideoTracks().length > 0) {
                        stream.getVideoTracks()[0].addEventListener('ended', () => {
                            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                                mediaRecorder.stop();
                                recordBtn.removeAttribute('disabled');
                                stopBtn.setAttribute('disabled', 'true');
                            }
                        });
                    }
                    mediaRecorder.start();
                    recordBtn.setAttribute('disabled', 'true');
                    stopBtn.removeAttribute('disabled');
                }
                catch (error) {
                    console.error('Error accessing media:', error);
                    let errorMessage = 'Unable to access camera. ';
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        errorMessage += 'Please allow camera access in your browser settings and try again.';
                    }
                    else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                        errorMessage += 'No camera found. Please connect a camera and try again.';
                    }
                    else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                        errorMessage += 'Camera is already in use by another application. Please close other applications using the camera and try again.';
                    }
                    else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
                        errorMessage += 'Camera does not support the required settings. Please try again.';
                    }
                    else if (error.name === 'NotSupportedError') {
                        errorMessage += 'Camera access is not supported in this browser. Please use a modern browser.';
                    }
                    else if (error.name === 'SecurityError') {
                        errorMessage += 'Camera access is blocked for security reasons. Please use HTTPS or localhost.';
                    }
                    else {
                        errorMessage += `Error: ${error.message || 'Unknown error'}. Please check permissions and try again.`;
                    }
                    if (recordingType === 'screen') {
                        alert('Unable to access screen. Please check permissions and try again.');
                    }
                    else {
                        alert(errorMessage);
                    }
                }
            });
            stopBtn.addEventListener('click', () => {
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                    this.trackEvent('video_recording_stopped', { type: recordingType });
                    recordBtn.removeAttribute('disabled');
                    stopBtn.setAttribute('disabled', 'true');
                    if (currentStream) {
                        currentStream.getTracks().forEach((track) => track.stop());
                        currentStream = null;
                    }
                }
            });
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Video Testimonial';
            submitButton.style.cssText = `
        width: 100%;
        padding: 12px;
        background-color: ${this.config?.theme.primaryColor || '#007bff'};
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
      `;
            submitButton.onclick = async () => {
                if (recordedChunks.length === 0) {
                    alert('Please record a video first');
                    return;
                }
                const formData = new FormData();
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                formData.append('video', blob, 'testimonial.webm');
                formData.append('siteId', this.siteId);
                formData.append('type', 'video');
                formData.append('metadata[sessionId]', this.sessionId);
                await this.submitTestimonial(formData);
            };
            videoContainer.appendChild(submitButton);
            container.appendChild(videoContainer);
            console.log('Video form appended to container, container children:', container.children.length);
        }
        showTextForm(container) {
            console.log('showTextForm called, container:', container);
            if (!this.config) {
                console.error('Config not available in showTextForm');
                return;
            }
            console.log('Creating text form');
            this.trackEvent('text_submission_started');
            const form = document.createElement('form');
            const formDesign = this.config.formDesign;
            // Determine layout
            const layoutClass = formDesign?.layout === 'two-column' ? 'two-column' :
                formDesign?.layout === 'three-column' ? 'three-column' : 'single';
            form.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: ${this.config?.theme?.fontFamily || 'inherit'};
      `;
            // Add header if configured
            if (formDesign?.showHeader) {
                const header = document.createElement('div');
                header.style.cssText = 'margin-bottom: 24px; text-align: center;';
                const title = document.createElement('h2');
                title.textContent = formDesign.headerText || 'Share Your Testimonial';
                title.style.cssText = `color: ${this.config?.theme?.primaryColor || '#007bff'}; margin-bottom: 8px; font-size: 24px; font-weight: bold;`;
                header.appendChild(title);
                if (formDesign.headerSubtext) {
                    const subtext = document.createElement('p');
                    subtext.textContent = formDesign.headerSubtext;
                    subtext.style.cssText = 'color: #666; font-size: 14px;';
                    header.appendChild(subtext);
                }
                form.appendChild(header);
            }
            // Create fields container with layout
            const fieldsContainer = document.createElement('div');
            if (layoutClass === 'two-column') {
                fieldsContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px;';
            }
            else if (layoutClass === 'three-column') {
                fieldsContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;';
            }
            else {
                fieldsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
            }
            // Use custom formDesign if available, otherwise use default
            const fields = formDesign?.fields || [
                { id: '1', type: 'text', label: 'Name', name: 'author[name]', placeholder: 'Enter your name', required: true, visible: true, order: 1 },
                { id: '2', type: 'email', label: 'Email', name: 'author[email]', placeholder: 'Enter your email', required: true, visible: true, order: 2 },
                { id: '3', type: 'textarea', label: 'Testimonial', name: 'text', placeholder: 'Share your experience...', required: true, visible: true, order: 3 },
                { id: '4', type: 'number', label: 'Rating', name: 'rating', placeholder: '1-5', required: false, visible: true, order: 4, min: 1, max: 5 },
            ];
            // Sort fields by order and filter visible ones
            const visibleFields = fields
                .filter(f => f.visible !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            visibleFields.forEach(field => {
                const fieldDiv = document.createElement('div');
                if (layoutClass === 'two-column' || layoutClass === 'three-column') {
                    // For grid layouts, some fields might span full width
                    if (field.type === 'textarea') {
                        fieldDiv.style.cssText = 'grid-column: 1 / -1;';
                    }
                }
                const label = document.createElement('label');
                label.textContent = field.label;
                label.style.cssText = 'display: block; margin-bottom: 8px; font-weight: bold; color: #333;';
                fieldDiv.appendChild(label);
                let input;
                if (field.type === 'textarea') {
                    input = document.createElement('textarea');
                    input.rows = 6;
                    input.name = field.name;
                    if (field.placeholder)
                        input.placeholder = field.placeholder;
                }
                else if (field.type === 'select') {
                    input = document.createElement('select');
                    input.name = field.name;
                    if (field.options) {
                        field.options.forEach(option => {
                            const optionEl = document.createElement('option');
                            optionEl.value = option;
                            optionEl.textContent = option;
                            input.appendChild(optionEl);
                        });
                    }
                }
                else if (field.type === 'checkbox') {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = field.name;
                    input.value = 'true';
                }
                else {
                    input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.name;
                    if (field.placeholder)
                        input.placeholder = field.placeholder;
                    if (field.min !== undefined)
                        input.min = field.min.toString();
                    if (field.max !== undefined)
                        input.max = field.max.toString();
                }
                if (field.required) {
                    input.required = true;
                }
                input.style.cssText = `
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: ${this.config?.theme?.borderRadius || '8px'};
          font-family: ${this.config?.theme?.fontFamily || 'inherit'};
          font-size: 14px;
        `;
                fieldDiv.appendChild(input);
                fieldsContainer.appendChild(fieldDiv);
            });
            form.appendChild(fieldsContainer);
            // Submit button
            const submitButtonContainer = document.createElement('div');
            const submitPosition = formDesign?.submitButtonPosition || 'full';
            submitButtonContainer.style.cssText = `
        margin-top: 16px;
        ${submitPosition === 'full' ? 'width: 100%;' : ''}
        ${submitPosition === 'center' ? 'display: flex; justify-content: center;' : ''}
        ${submitPosition === 'right' ? 'display: flex; justify-content: flex-end;' : ''}
        ${submitPosition === 'left' ? 'display: flex; justify-content: flex-start;' : ''}
      `;
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = formDesign?.submitButtonText || 'Submit Testimonial';
            submitButton.style.cssText = `
        ${submitPosition === 'full' ? 'width: 100%;' : 'padding-left: 32px; padding-right: 32px;'}
        padding-top: 12px;
        padding-bottom: 12px;
            background-color: ${this.config?.theme?.primaryColor || '#007bff'};
        color: white;
        border: none;
        border-radius: ${this.config?.theme?.borderRadius || '8px'};
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
      `;
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                formData.append('siteId', this.siteId);
                formData.append('type', 'text');
                formData.append('metadata[sessionId]', this.sessionId);
                await this.submitTestimonial(formData);
            };
            submitButtonContainer.appendChild(submitButton);
            form.appendChild(submitButtonContainer);
            // Add footer if configured
            if (formDesign?.showFooter && formDesign.footerText) {
                const footer = document.createElement('div');
                footer.style.cssText = 'margin-top: 16px; text-align: center; color: #666; font-size: 12px;';
                footer.textContent = formDesign.footerText;
                form.appendChild(footer);
            }
            container.appendChild(form);
        }
        async submitTestimonial(formData) {
            try {
                const response = await fetch(`${this.apiUrl}/api/testimonials`, {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Failed to submit testimonial');
                }
                this.trackEvent('testimonial_submitted');
                this.trackEvent('testimonial_completed');
                const modal = document.getElementById('testimonial-modal');
                const drawer = document.getElementById('testimonial-drawer');
                if (modal)
                    document.body.removeChild(modal);
                if (drawer)
                    document.body.removeChild(drawer);
                alert('Thank you for your testimonial!');
            }
            catch (error) {
                console.error('Error submitting testimonial:', error);
                alert('Failed to submit testimonial. Please try again.');
            }
        }
        async trackEvent(eventType, properties) {
            try {
                await fetch(`${this.apiUrl}/api/analytics/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        siteId: this.siteId,
                        eventType,
                        properties: properties || {},
                        metadata: {
                            pageUrl: window.location.href,
                            sessionId: this.sessionId,
                        },
                    }),
                });
            }
            catch (error) {
                console.error('Failed to track event:', error);
            }
        }
        // Public method to display testimonials
        async displayTestimonials(containerId, options) {
            try {
                // Load config if not already loaded
                if (!this.config) {
                    await this.loadConfig();
                }
                const response = await fetch(`${this.apiUrl}/api/testimonials?siteId=${this.siteId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch testimonials');
                }
                const testimonials = await response.json();
                const container = document.getElementById(containerId);
                if (!container) {
                    console.error(`Container with ID "${containerId}" not found`);
                    return;
                }
                // Use config from dashboard or fallback to options/defaults
                const displayConfig = this.config?.testimonialDisplay;
                const layout = options?.layout || displayConfig?.layout || 'grid';
                const limit = options?.limit || displayConfig?.limit || testimonials.length;
                const showRating = options?.showRating !== undefined ? options.showRating : (displayConfig?.showRating !== false);
                const showAuthor = options?.showAuthor !== undefined ? options.showAuthor : (displayConfig?.showAuthor !== false);
                const showVideo = displayConfig?.showVideo !== false;
                // Filter testimonials by type if needed
                const filteredTestimonials = showVideo
                    ? testimonials
                    : testimonials.filter((t) => t.type !== 'video');
                const limitedTestimonials = filteredTestimonials.slice(0, limit);
                // Apply spacing from config
                const gap = displayConfig?.spacing?.gap || '24px';
                const margin = displayConfig?.spacing?.margin || '0';
                if (layout === 'grid') {
                    const itemsPerRow = displayConfig?.itemsPerRow || 3;
                    container.style.cssText = `display: grid; grid-template-columns: repeat(${itemsPerRow}, 1fr); gap: ${gap}; margin: ${margin};`;
                }
                else if (layout === 'carousel') {
                    container.style.cssText = `display: flex; overflow-x: auto; gap: ${gap}; padding: 20px 0; scroll-snap-type: x mandatory; margin: ${margin};`;
                }
                else {
                    container.style.cssText = `display: flex; flex-direction: column; gap: ${gap}; margin: ${margin};`;
                }
                const getShadowStyle = (shadow) => {
                    switch (shadow) {
                        case 'small': return '0 1px 3px rgba(0, 0, 0, 0.1)';
                        case 'medium': return '0 4px 6px rgba(0, 0, 0, 0.1)';
                        case 'large': return '0 10px 15px rgba(0, 0, 0, 0.1)';
                        default: return 'none';
                    }
                };
                limitedTestimonials.forEach((testimonial) => {
                    const cardStyle = displayConfig?.cardStyle || {
                        backgroundColor: '#ffffff',
                        textColor: '#111827',
                        borderColor: '#e5e7eb',
                        borderRadius: '12px',
                        padding: '24px',
                        shadow: 'medium'
                    };
                    const card = document.createElement('div');
                    card.style.cssText = `
            background: ${cardStyle.backgroundColor || '#ffffff'};
            color: ${cardStyle.textColor || '#111827'};
            border: 1px solid ${cardStyle.borderColor || '#e5e7eb'};
            border-radius: ${cardStyle.borderRadius || this.config?.theme?.borderRadius || '12px'};
            padding: ${cardStyle.padding || '24px'};
            box-shadow: ${getShadowStyle(cardStyle.shadow || 'medium')};
            ${layout === 'carousel' ? 'min-width: 300px; scroll-snap-align: start;' : ''}
            font-family: ${this.config?.theme?.fontFamily || 'inherit'};
          `;
                    // Author info
                    if (showAuthor && testimonial.author) {
                        const authorDiv = document.createElement('div');
                        authorDiv.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 16px;';
                        if (testimonial.author.avatar) {
                            const avatar = document.createElement('img');
                            avatar.src = testimonial.author.avatar;
                            avatar.style.cssText = 'width: 48px; height: 48px; border-radius: 50%; object-fit: cover;';
                            authorDiv.appendChild(avatar);
                        }
                        else {
                            const avatarPlaceholder = document.createElement('div');
                            avatarPlaceholder.style.cssText = `
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: ${this.config?.theme.primaryColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
              `;
                            avatarPlaceholder.textContent = testimonial.author.name ? testimonial.author.name.charAt(0).toUpperCase() : '?';
                            authorDiv.appendChild(avatarPlaceholder);
                        }
                        const authorInfo = document.createElement('div');
                        const name = document.createElement('div');
                        name.style.cssText = 'font-weight: 600; font-size: 16px; color: #111827;';
                        name.textContent = testimonial.author.name || 'Anonymous';
                        authorInfo.appendChild(name);
                        if (testimonial.author.company || testimonial.author.position) {
                            const meta = document.createElement('div');
                            meta.style.cssText = 'font-size: 14px; color: #6b7280; margin-top: 4px;';
                            meta.textContent = [testimonial.author.position, testimonial.author.company].filter(Boolean).join(' at ');
                            authorInfo.appendChild(meta);
                        }
                        authorDiv.appendChild(authorInfo);
                        card.appendChild(authorDiv);
                    }
                    // Rating
                    if (showRating && testimonial.rating) {
                        const ratingStyle = displayConfig?.ratingStyle || {
                            starColor: '#fbbf24',
                            emptyStarColor: '#d1d5db',
                            size: 'medium'
                        };
                        const ratingDiv = document.createElement('div');
                        ratingDiv.style.cssText = 'display: flex; gap: 4px; margin-bottom: 16px;';
                        const starSize = ratingStyle.size === 'small' ? '16px' : ratingStyle.size === 'large' ? '24px' : '20px';
                        for (let i = 1; i <= 5; i++) {
                            const star = document.createElement('span');
                            star.textContent = i <= testimonial.rating ? '★' : '☆';
                            star.style.cssText = `color: ${i <= testimonial.rating ? (ratingStyle.starColor || '#fbbf24') : (ratingStyle.emptyStarColor || '#d1d5db')}; font-size: ${starSize};`;
                            ratingDiv.appendChild(star);
                        }
                        card.appendChild(ratingDiv);
                    }
                    // Testimonial content
                    if (testimonial.type === 'video' && testimonial.videoUrl) {
                        // Create video container with modern design
                        const videoContainer = document.createElement('div');
                        videoContainer.style.cssText = `
              position: relative;
              width: 100%;
              margin-bottom: 16px;
              border-radius: ${cardStyle.borderRadius || '12px'};
              overflow: hidden;
              background: #000;
              aspect-ratio: 16 / 9;
              cursor: pointer;
            `;
                        const video = document.createElement('video');
                        video.src = testimonial.videoUrl;
                        video.controls = false; // We'll add custom controls
                        video.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            `;
                        if (testimonial.videoThumbnail) {
                            video.poster = testimonial.videoThumbnail;
                        }
                        // Create play button overlay
                        const playOverlay = document.createElement('div');
                        playOverlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.3);
              transition: background 0.3s ease;
              z-index: 1;
            `;
                        const playButton = document.createElement('div');
                        playButton.style.cssText = `
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.95);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: transform 0.2s ease, background 0.2s ease;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
                        // Play icon (triangle)
                        const playIcon = document.createElement('div');
                        playIcon.style.cssText = `
              width: 0;
              height: 0;
              border-left: 20px solid ${this.config?.theme?.primaryColor || '#667eea'};
              border-top: 12px solid transparent;
              border-bottom: 12px solid transparent;
              margin-left: 4px;
            `;
                        playButton.appendChild(playIcon);
                        let isPlaying = false;
                        playButton.onmouseenter = () => {
                            if (!isPlaying) {
                                playButton.style.transform = 'scale(1.1)';
                                playButton.style.background = 'rgba(255, 255, 255, 1)';
                            }
                        };
                        playButton.onmouseleave = () => {
                            if (!isPlaying) {
                                playButton.style.transform = 'scale(1)';
                                playButton.style.background = 'rgba(255, 255, 255, 0.95)';
                            }
                        };
                        // Play button click handler
                        const handlePlay = () => {
                            if (video.paused) {
                                video.play();
                                playOverlay.style.display = 'none';
                                video.controls = true;
                                isPlaying = true;
                            }
                            else {
                                video.pause();
                                playOverlay.style.display = 'flex';
                                video.controls = false;
                                isPlaying = false;
                            }
                        };
                        playButton.onclick = (e) => {
                            e.stopPropagation();
                            handlePlay();
                        };
                        videoContainer.onclick = handlePlay;
                        // Show overlay when video ends or pauses
                        video.addEventListener('pause', () => {
                            if (video.currentTime > 0) {
                                playOverlay.style.display = 'flex';
                                video.controls = false;
                                isPlaying = false;
                            }
                        });
                        video.addEventListener('ended', () => {
                            playOverlay.style.display = 'flex';
                            video.controls = false;
                            isPlaying = false;
                        });
                        playOverlay.appendChild(playButton);
                        videoContainer.appendChild(video);
                        videoContainer.appendChild(playOverlay);
                        card.appendChild(videoContainer);
                    }
                    else if (testimonial.text) {
                        const text = document.createElement('p');
                        text.textContent = testimonial.text;
                        text.style.cssText = 'color: #374151; line-height: 1.6; margin-bottom: 16px;';
                        card.appendChild(text);
                    }
                    container.appendChild(card);
                });
                if (limitedTestimonials.length === 0) {
                    const empty = document.createElement('div');
                    empty.style.cssText = 'text-align: center; padding: 40px; color: #6b7280;';
                    empty.textContent = 'No testimonials yet. Be the first to share your experience!';
                    container.appendChild(empty);
                }
                this.trackEvent('testimonials_displayed', { count: limitedTestimonials.length, layout });
            }
            catch (error) {
                console.error('Error displaying testimonials:', error);
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = '<p style="color: #ef4444;">Failed to load testimonials. Please try again later.</p>';
                }
            }
        }
    }
    // Expose widget class globally for manual initialization
    // This must happen before auto-initialization
    // Assign to window first to ensure it's available immediately
    if (typeof window !== 'undefined') {
        window.TestimonialWidget = TestimonialWidget;
    }
    // Auto-initialize if script tag has data-site-id attribute
    // Handle both static and dynamically loaded scripts
    const scriptTag = document.currentScript;
    if (scriptTag && scriptTag.dataset.siteId) {
        const siteId = scriptTag.dataset.siteId;
        const apiUrl = scriptTag.dataset.apiUrl;
        new TestimonialWidget(siteId, apiUrl);
    }
    else {
        // Fallback: Check for script tags with data-site-id (for dynamically loaded scripts)
        // This handles cases where document.currentScript is null
        const scripts = document.querySelectorAll('script[data-site-id]');
        scripts.forEach((script) => {
            const scriptEl = script;
            if (scriptEl.dataset.siteId && !scriptEl.dataset.initialized) {
                scriptEl.dataset.initialized = 'true';
                const siteId = scriptEl.dataset.siteId;
                const apiUrl = scriptEl.dataset.apiUrl;
                new TestimonialWidget(siteId, apiUrl);
            }
        });
    }
    // Helper function to display testimonials
    window.displayTestimonials = async function (siteId, containerId, options) {
        const apiUrl = options?.apiUrl || (() => {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const src = scripts[i].src;
                if (src.includes('script.js')) {
                    // Handle both /script.js and /api/script.js
                    return src.replace(/\/api\/script\.js$/, '').replace(/\/script\.js$/, '');
                }
            }
            return window.location.origin;
        })();
        try {
            const response = await fetch(`${apiUrl}/api/testimonials?siteId=${siteId}&published=true`);
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            const testimonials = await response.json();
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container with ID "${containerId}" not found`);
                return;
            }
            const layout = options?.layout || 'grid';
            const limit = options?.limit || testimonials.length;
            const showRating = options?.showRating !== false;
            const showAuthor = options?.showAuthor !== false;
            const limitedTestimonials = testimonials.slice(0, limit);
            if (layout === 'grid') {
                container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;';
            }
            else if (layout === 'carousel') {
                container.style.cssText = 'display: flex; overflow-x: auto; gap: 24px; padding: 20px 0; scroll-snap-type: x mandatory;';
            }
            else {
                container.style.cssText = 'display: flex; flex-direction: column; gap: 24px;';
            }
            limitedTestimonials.forEach((testimonial) => {
                const card = document.createElement('div');
                card.style.cssText = `
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          ${layout === 'carousel' ? 'min-width: 300px; scroll-snap-align: start;' : ''}
        `;
                // Author info
                if (showAuthor && testimonial.author) {
                    const authorDiv = document.createElement('div');
                    authorDiv.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 16px;';
                    if (testimonial.author.avatar) {
                        const avatar = document.createElement('img');
                        avatar.src = testimonial.author.avatar;
                        avatar.style.cssText = 'width: 48px; height: 48px; border-radius: 50%; object-fit: cover;';
                        authorDiv.appendChild(avatar);
                    }
                    else {
                        const avatarPlaceholder = document.createElement('div');
                        avatarPlaceholder.style.cssText = `
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
            `;
                        avatarPlaceholder.textContent = testimonial.author.name ? testimonial.author.name.charAt(0).toUpperCase() : '?';
                        authorDiv.appendChild(avatarPlaceholder);
                    }
                    const authorInfo = document.createElement('div');
                    const name = document.createElement('div');
                    name.style.cssText = 'font-weight: 600; font-size: 16px; color: #111827;';
                    name.textContent = testimonial.author.name || 'Anonymous';
                    authorInfo.appendChild(name);
                    if (testimonial.author.company || testimonial.author.position) {
                        const meta = document.createElement('div');
                        meta.style.cssText = 'font-size: 14px; color: #6b7280; margin-top: 4px;';
                        meta.textContent = [testimonial.author.position, testimonial.author.company].filter(Boolean).join(' at ');
                        authorInfo.appendChild(meta);
                    }
                    authorDiv.appendChild(authorInfo);
                    card.appendChild(authorDiv);
                }
                // Rating
                if (showRating && testimonial.rating) {
                    const ratingDiv = document.createElement('div');
                    ratingDiv.style.cssText = 'display: flex; gap: 4px; margin-bottom: 16px;';
                    for (let i = 1; i <= 5; i++) {
                        const star = document.createElement('span');
                        star.textContent = i <= testimonial.rating ? '★' : '☆';
                        star.style.cssText = `color: ${i <= testimonial.rating ? '#fbbf24' : '#d1d5db'}; font-size: 20px;`;
                        ratingDiv.appendChild(star);
                    }
                    card.appendChild(ratingDiv);
                }
                // Testimonial content
                if (testimonial.type === 'video' && testimonial.videoUrl) {
                    // Create video container with modern design
                    const videoContainer = document.createElement('div');
                    videoContainer.style.cssText = `
            position: relative;
            width: 100%;
            margin-bottom: 16px;
            border-radius: 12px;
            overflow: hidden;
            background: #000;
            aspect-ratio: 16 / 9;
            cursor: pointer;
          `;
                    const video = document.createElement('video');
                    video.src = testimonial.videoUrl;
                    video.controls = false; // We'll add custom controls
                    video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          `;
                    if (testimonial.videoThumbnail) {
                        video.poster = testimonial.videoThumbnail;
                    }
                    // Create play button overlay
                    const playOverlay = document.createElement('div');
                    playOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            transition: background 0.3s ease;
            z-index: 1;
          `;
                    const playButton = document.createElement('div');
                    playButton.style.cssText = `
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          `;
                    // Play icon (triangle)
                    const playIcon = document.createElement('div');
                    playIcon.style.cssText = `
            width: 0;
            height: 0;
            border-left: 20px solid #667eea;
            border-top: 12px solid transparent;
            border-bottom: 12px solid transparent;
            margin-left: 4px;
          `;
                    playButton.appendChild(playIcon);
                    let isPlaying = false;
                    playButton.onmouseenter = () => {
                        if (!isPlaying) {
                            playButton.style.transform = 'scale(1.1)';
                            playButton.style.background = 'rgba(255, 255, 255, 1)';
                        }
                    };
                    playButton.onmouseleave = () => {
                        if (!isPlaying) {
                            playButton.style.transform = 'scale(1)';
                            playButton.style.background = 'rgba(255, 255, 255, 0.95)';
                        }
                    };
                    // Play button click handler
                    const handlePlay = () => {
                        if (video.paused) {
                            video.play();
                            playOverlay.style.display = 'none';
                            video.controls = true;
                            isPlaying = true;
                        }
                        else {
                            video.pause();
                            playOverlay.style.display = 'flex';
                            video.controls = false;
                            isPlaying = false;
                        }
                    };
                    playButton.onclick = (e) => {
                        e.stopPropagation();
                        handlePlay();
                    };
                    videoContainer.onclick = handlePlay;
                    // Show overlay when video ends or pauses
                    video.addEventListener('pause', () => {
                        if (video.currentTime > 0) {
                            playOverlay.style.display = 'flex';
                            video.controls = false;
                            isPlaying = false;
                        }
                    });
                    video.addEventListener('ended', () => {
                        playOverlay.style.display = 'flex';
                        video.controls = false;
                        isPlaying = false;
                    });
                    playOverlay.appendChild(playButton);
                    videoContainer.appendChild(video);
                    videoContainer.appendChild(playOverlay);
                    card.appendChild(videoContainer);
                }
                else if (testimonial.text) {
                    const text = document.createElement('p');
                    text.textContent = testimonial.text;
                    text.style.cssText = 'color: #374151; line-height: 1.6; margin-bottom: 16px;';
                    card.appendChild(text);
                }
                container.appendChild(card);
            });
            if (limitedTestimonials.length === 0) {
                const empty = document.createElement('div');
                empty.style.cssText = 'text-align: center; padding: 40px; color: #6b7280;';
                empty.textContent = 'No testimonials yet. Be the first to share your experience!';
                container.appendChild(empty);
            }
        }
        catch (error) {
            console.error('Error displaying testimonials:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p style="color: #ef4444;">Failed to load testimonials. Please try again later.</p>';
            }
        }
    };
    // Store the class outside the IIFE
    TestimonialWidgetClass = TestimonialWidget;
    // Expose to window using Object.defineProperty to prevent overwriting
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'TestimonialWidget', {
            value: TestimonialWidget,
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
    // Return the class for webpack UMD wrapper
    // This ensures root["TestimonialWidget"] gets the class
    return TestimonialWidget;
})();
// After UMD wrapper executes, fix window.TestimonialWidget if it was overwritten
if (typeof window !== 'undefined' && TestimonialWidgetClass) {
    // Function to check and fix
    const checkAndFix = () => {
        const current = window.TestimonialWidget;
        // If it's an empty object or not a function, fix it
        if (!current || typeof current !== 'function' || (typeof current === 'object' && Object.keys(current).length === 0)) {
            window.TestimonialWidget = TestimonialWidgetClass;
        }
    };
    // Check immediately
    checkAndFix();
    // Use setTimeout to ensure this runs after UMD wrapper
    setTimeout(checkAndFix, 0);
    // Also use Promise to catch it earlier
    Promise.resolve().then(checkAndFix);
    // And on next tick
    if (typeof setImmediate !== 'undefined') {
        setImmediate(checkAndFix);
    }
}

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});