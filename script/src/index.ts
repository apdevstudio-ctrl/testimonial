/**
 * Testimonial SaaS - Injectable Script
 * This script can be injected into any website to enable testimonial collection
 */

// Store the class outside the IIFE so it persists after UMD wrapper executes
let TestimonialWidgetClass: any;

(function () {
  'use strict';

  interface SiteConfig {
    siteId: string;
    button: {
      enabled: boolean;
      type: 'floating' | 'inline';
      position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
      text: string;
      backgroundColor: string;
      textColor: string;
      shape: 'rounded' | 'square' | 'pill';
      size: 'small' | 'medium' | 'large';
      visibility: {
        hideOnMobile: boolean;
        hideOnDesktop: boolean;
        hideAfterSubmission: boolean;
      };
    };
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      borderRadius: string;
      buttonStyle: 'filled' | 'outlined' | 'text';
    };
    enabledFeatures: {
      videoTestimonial: boolean;
      textTestimonial: boolean;
    };
    flowType: 'modal' | 'drawer' | 'page';
    testimonialDisplay?: {
      layout: 'grid' | 'carousel' | 'list';
      itemsPerRow?: number;
      limit?: number;
      showRating: boolean;
      showAuthor: boolean;
      showVideo: boolean;
      cardStyle: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
        borderRadius: string;
        padding: string;
        shadow: 'none' | 'small' | 'medium' | 'large';
      };
      authorStyle: {
        showAvatar: boolean;
        avatarSize: string;
        showCompany: boolean;
        showPosition: boolean;
        textColor: string;
      };
      ratingStyle: {
        starColor: string;
        emptyStarColor: string;
        size: 'small' | 'medium' | 'large';
      };
      spacing: {
        gap: string;
        margin: string;
      };
    };
    formDesign?: {
      fields: Array<{
        id: string;
        type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox';
        label: string;
        name: string;
        placeholder?: string;
        required: boolean;
        visible: boolean;
        order: number;
        options?: string[];
        min?: number;
        max?: number;
      }>;
      layout: 'single' | 'two-column' | 'three-column';
      showHeader: boolean;
      headerText: string;
      headerSubtext?: string;
      showFooter: boolean;
      footerText?: string;
      submitButtonText: string;
      submitButtonPosition: 'left' | 'center' | 'right' | 'full';
    };
    apiUrl: string;
  }

  class TestimonialWidget {
    private siteId: string;
    private config: SiteConfig | null = null;
    private shadowRoot: ShadowRoot | null = null;
    private sessionId: string;
    private apiUrl: string;

    constructor(siteId: string, apiUrl?: string) {
      this.siteId = siteId;
      this.apiUrl = apiUrl || this.detectApiUrl();
      this.sessionId = this.generateSessionId();
      this.init();
    }

    private detectApiUrl(): string {
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

    private generateSessionId(): string {
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private async init(): Promise<void> {
      try {
        await this.loadConfig();
        if (this.config && this.config.button.enabled) {
          this.injectButton();
          this.trackEvent('button_view');
        }
      } catch (error) {
        console.error('Failed to initialize testimonial widget:', error);
      }
    }

    private async loadConfig(): Promise<void> {
      try {
        const response = await fetch(`${this.apiUrl}/api/config/${this.siteId}`);
        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }
        this.config = await response.json();
      } catch (error) {
        console.error('Failed to load configuration:', error);
      }
    }

    private injectButton(): void {
      if (!this.config) return;

      // Create shadow DOM container
      const container = document.createElement('div');
      container.id = 'testimonial-widget-container';
      document.body.appendChild(container);

      this.shadowRoot = container.attachShadow({ mode: 'closed' });

      const button = this.createButton();
      this.shadowRoot.appendChild(button);
    }

    private createButton(): HTMLElement {
      if (!this.config) throw new Error('Config not loaded');

      const button = document.createElement('button');
      button.textContent = this.config.button.text;
      button.id = 'testimonial-button';

      // Apply styles
      const styles = this.getButtonStyles();
      button.setAttribute('style', styles);

      // Add click handler
      button.addEventListener('click', () => {
        this.trackEvent('button_click');
        this.openTestimonialFlow();
      });

      return button;
    }

    private getButtonStyles(): string {
      if (!this.config) return '';

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

    private async openTestimonialFlow(): Promise<void> {
      if (!this.config) return;

      switch (this.config.flowType) {
        case 'modal':
          this.openModal();
          break;
        case 'drawer':
          this.openDrawer();
          break;
        case 'page':
          this.openPage();
          break;
      }
    }

    private openModal(): void {
      const modal = document.createElement('div');
      modal.id = 'testimonial-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000000;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

      const content = this.createTestimonialContent();
      modal.appendChild(content);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });

      document.body.appendChild(modal);
    }

    private openDrawer(): void {
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

    private openPage(): void {
      const iframe = document.createElement('iframe');
      iframe.src = `${this.apiUrl}/testimonial-form/${this.siteId}`;
      iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        z-index: 1000000;
      `;
      document.body.appendChild(iframe);
    }

    private createTestimonialContent(): HTMLElement {
      if (!this.config) throw new Error('Config not loaded');

      const container = document.createElement('div');
      container.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: ${this.config?.theme?.borderRadius || '8px'};
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      `;

      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.cssText = `
        float: right;
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #666;
      `;
      closeButton.onclick = () => {
        const modal = document.getElementById('testimonial-modal');
        const drawer = document.getElementById('testimonial-drawer');
        if (modal) document.body.removeChild(modal);
        if (drawer) document.body.removeChild(drawer);
      };
      container.appendChild(closeButton);

      const title = document.createElement('h2');
      title.textContent = 'Share Your Testimonial';
      title.style.cssText = `color: ${this.config?.theme?.primaryColor || '#007bff'}; margin-bottom: 24px;`;
      container.appendChild(title);

      const formContainer = document.createElement('div');
      formContainer.id = 'testimonial-form-container';
      container.appendChild(formContainer);

      // Check how many features are enabled
      const hasVideo = this.config.enabledFeatures.videoTestimonial;
      const hasText = this.config.enabledFeatures.textTestimonial;
      const bothEnabled = hasVideo && hasText;

      if (bothEnabled) {
        // Show selection buttons only if both are enabled
        const typeSelector = document.createElement('div');
        typeSelector.style.cssText = 'display: flex; gap: 16px; margin-bottom: 24px;';

        const videoButton = this.createTypeButton('Video Testimonial', 'video');
        typeSelector.appendChild(videoButton);

        const textButton = this.createTypeButton('Text Testimonial', 'text');
        typeSelector.appendChild(textButton);

        container.insertBefore(typeSelector, formContainer);
      } else {
        // If only one is enabled, show that form directly
        if (hasVideo) {
          this.showForm('video');
        } else if (hasText) {
          this.showForm('text');
        } else {
          // Neither enabled - show message
          const message = document.createElement('p');
          message.textContent = 'Testimonial submission is currently unavailable.';
          message.style.cssText = 'color: #666; text-align: center; padding: 20px;';
          formContainer.appendChild(message);
        }
      }

      return container;
    }

    private createTypeButton(label: string, type: 'video' | 'text'): HTMLElement {
      if (!this.config) throw new Error('Config not loaded');

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

    private showForm(type: 'video' | 'text'): void {
      const container = document.getElementById('testimonial-form-container');
      if (!container) return;

      container.innerHTML = '';

      if (type === 'video') {
        this.showVideoForm(container);
      } else {
        this.showTextForm(container);
      }
    }

    private showVideoForm(container: HTMLElement): void {
      if (!this.config) return;

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

      const webcamBtn = videoContainer.querySelector('#webcam-btn') as HTMLButtonElement;
      const screenBtn = videoContainer.querySelector('#screen-btn') as HTMLButtonElement;
      const recordBtn = videoContainer.querySelector('#record-btn') as HTMLButtonElement;
      const stopBtn = videoContainer.querySelector('#stop-btn') as HTMLButtonElement;
      const preview = videoContainer.querySelector('#testimonial-video-preview') as HTMLVideoElement;
      const screenPreview = videoContainer.querySelector('#screen-preview') as HTMLElement;
      const recorded = videoContainer.querySelector('#testimonial-video-recorded') as HTMLVideoElement;

      let mediaRecorder: MediaRecorder;
      let recordedChunks: Blob[] = [];
      let currentStream: MediaStream | null = null;
      let recordingType: 'webcam' | 'screen' = 'webcam';

      // Set default to webcam
      webcamBtn.style.backgroundColor = this.config?.theme?.primaryColor || '#007bff';
      screenBtn.style.backgroundColor = '#6c757d';
      preview.style.display = 'block';
      screenPreview.style.display = 'none';

      webcamBtn.addEventListener('click', () => {
        recordingType = 'webcam';
        webcamBtn.style.backgroundColor = this.config!.theme.primaryColor;
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
          let stream: MediaStream;

          if (recordingType === 'screen') {
            // Screen recording
            stream = await navigator.mediaDevices.getDisplayMedia({ 
              video: { 
                displaySurface: 'browser' as any
              } as any, 
              audio: true 
            });
            preview.srcObject = stream;
            preview.style.display = 'block';
            screenPreview.style.display = 'none';
            this.trackEvent('screen_recording_started');
          } else {
            // Webcam recording
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            preview.srcObject = stream;
            preview.style.display = 'block';
            screenPreview.style.display = 'none';
            this.trackEvent('video_recording_started');
          }

          currentStream = stream;

          mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus'
          });
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
          stream.getVideoTracks()[0].addEventListener('ended', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
              recordBtn.removeAttribute('disabled');
              stopBtn.setAttribute('disabled', 'true');
            }
          });

          mediaRecorder.start();
          recordBtn.setAttribute('disabled', 'true');
          stopBtn.removeAttribute('disabled');
        } catch (error: any) {
          console.error('Error accessing media:', error);
          if (recordingType === 'screen') {
            alert('Unable to access screen. Please check permissions and try again.');
          } else {
            alert('Unable to access camera. Please check permissions.');
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
    }

    private showTextForm(container: HTMLElement): void {
      if (!this.config) return;

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
      } else if (layoutClass === 'three-column') {
        fieldsContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;';
      } else {
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

        let input: HTMLElement;
        if (field.type === 'textarea') {
          input = document.createElement('textarea');
          (input as HTMLTextAreaElement).rows = 6;
          (input as HTMLTextAreaElement).name = field.name;
          if (field.placeholder) (input as HTMLTextAreaElement).placeholder = field.placeholder;
        } else if (field.type === 'select') {
          input = document.createElement('select');
          (input as HTMLSelectElement).name = field.name;
          if (field.options) {
            field.options.forEach(option => {
              const optionEl = document.createElement('option');
              optionEl.value = option;
              optionEl.textContent = option;
              (input as HTMLSelectElement).appendChild(optionEl);
            });
          }
        } else if (field.type === 'checkbox') {
          input = document.createElement('input');
          (input as HTMLInputElement).type = 'checkbox';
          (input as HTMLInputElement).name = field.name;
          (input as HTMLInputElement).value = 'true';
        } else {
          input = document.createElement('input');
          (input as HTMLInputElement).type = field.type;
          (input as HTMLInputElement).name = field.name;
          if (field.placeholder) (input as HTMLInputElement).placeholder = field.placeholder;
          if (field.min !== undefined) (input as HTMLInputElement).min = field.min.toString();
          if (field.max !== undefined) (input as HTMLInputElement).max = field.max.toString();
        }

        if (field.required) {
          (input as HTMLInputElement).required = true;
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

    private async submitTestimonial(formData: FormData): Promise<void> {
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
        if (modal) document.body.removeChild(modal);
        if (drawer) document.body.removeChild(drawer);

        alert('Thank you for your testimonial!');
      } catch (error) {
        console.error('Error submitting testimonial:', error);
        alert('Failed to submit testimonial. Please try again.');
      }
    }

    private async trackEvent(
      eventType: string,
      properties?: Record<string, any>,
    ): Promise<void> {
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
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    }

    // Public method to display testimonials
    public async displayTestimonials(
      containerId: string,
      options?: {
        layout?: 'grid' | 'carousel' | 'list';
        limit?: number;
        showRating?: boolean;
        showAuthor?: boolean;
      }
    ): Promise<void> {
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
          : testimonials.filter((t: any) => t.type !== 'video');
        
        const limitedTestimonials = filteredTestimonials.slice(0, limit);

        // Apply spacing from config
        const gap = displayConfig?.spacing?.gap || '24px';
        const margin = displayConfig?.spacing?.margin || '0';

        if (layout === 'grid') {
          const itemsPerRow = displayConfig?.itemsPerRow || 3;
          container.style.cssText = `display: grid; grid-template-columns: repeat(${itemsPerRow}, 1fr); gap: ${gap}; margin: ${margin};`;
        } else if (layout === 'carousel') {
          container.style.cssText = `display: flex; overflow-x: auto; gap: ${gap}; padding: 20px 0; scroll-snap-type: x mandatory; margin: ${margin};`;
        } else {
          container.style.cssText = `display: flex; flex-direction: column; gap: ${gap}; margin: ${margin};`;
        }

        const getShadowStyle = (shadow: string) => {
          switch (shadow) {
            case 'small': return '0 1px 3px rgba(0, 0, 0, 0.1)';
            case 'medium': return '0 4px 6px rgba(0, 0, 0, 0.1)';
            case 'large': return '0 10px 15px rgba(0, 0, 0, 0.1)';
            default: return 'none';
          }
        };

        limitedTestimonials.forEach((testimonial: any) => {
          const cardStyle = displayConfig?.cardStyle || {
            backgroundColor: '#ffffff',
            textColor: '#111827',
            borderColor: '#e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            shadow: 'medium' as 'none' | 'small' | 'medium' | 'large'
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
            } else {
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
              size: 'medium' as 'small' | 'medium' | 'large'
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
            const video = document.createElement('video');
            video.src = testimonial.videoUrl;
            video.controls = true;
            video.style.cssText = 'width: 100%; border-radius: 8px; margin-bottom: 16px;';
            if (testimonial.videoThumbnail) {
              video.poster = testimonial.videoThumbnail;
            }
            card.appendChild(video);
          } else if (testimonial.text) {
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
      } catch (error) {
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
    (window as any).TestimonialWidget = TestimonialWidget;
  }
  
  // Auto-initialize if script tag has data-site-id attribute
  const scriptTag = document.currentScript as HTMLScriptElement;
  if (scriptTag && scriptTag.dataset.siteId) {
    const siteId = scriptTag.dataset.siteId;
    const apiUrl = scriptTag.dataset.apiUrl;
    new TestimonialWidget(siteId, apiUrl);
  }

  // Helper function to display testimonials
  (window as any).displayTestimonials = async function(
    siteId: string,
    containerId: string,
    options?: {
      layout?: 'grid' | 'carousel' | 'list';
      limit?: number;
      showRating?: boolean;
      showAuthor?: boolean;
      apiUrl?: string;
    }
  ) {
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
      } else if (layout === 'carousel') {
        container.style.cssText = 'display: flex; overflow-x: auto; gap: 24px; padding: 20px 0; scroll-snap-type: x mandatory;';
      } else {
        container.style.cssText = 'display: flex; flex-direction: column; gap: 24px;';
      }

      limitedTestimonials.forEach((testimonial: any) => {
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
          } else {
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
          const video = document.createElement('video');
          video.src = testimonial.videoUrl;
          video.controls = true;
          video.style.cssText = 'width: 100%; border-radius: 8px; margin-bottom: 16px;';
          if (testimonial.videoThumbnail) {
            video.poster = testimonial.videoThumbnail;
          }
          card.appendChild(video);
        } else if (testimonial.text) {
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
    } catch (error) {
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
    const current = (window as any).TestimonialWidget;
    // If it's an empty object or not a function, fix it
    if (!current || typeof current !== 'function' || (typeof current === 'object' && Object.keys(current).length === 0)) {
      (window as any).TestimonialWidget = TestimonialWidgetClass;
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

