class AutoImageSlider extends HTMLElement {
    constructor() {
        super();
        this.currentIndex = 0;
        this.intervalId = null;
        this.images = [];
        this.intervalSeconds = 3;
        this.transitionSpeed = 0.8;
    }

    static get observedAttributes() {
        return ['images', 'interval', 'transition-speed'];
    }

    connectedCallback() {
        this.parseAttributes();
        this.render();
        this.startSlideshow();
    }

    disconnectedCallback() {
        this.stopSlideshow();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.parseAttributes();
            if (this.isConnected) {
                this.render();
                this.restartSlideshow();
            }
        }
    }

    parseAttributes() {
        // Parse images array
        const imagesAttr = this.getAttribute('images');
        if (imagesAttr) {
            try {
                this.images = JSON.parse(imagesAttr);
            } catch (e) {
                console.error('Invalid images JSON:', e);
                this.images = [];
            }
        }

        // Parse interval
        const intervalAttr = this.getAttribute('interval');
        if (intervalAttr) {
            const parsed = parseFloat(intervalAttr);
            if (!isNaN(parsed) && parsed > 0) {
                this.intervalSeconds = parsed;
            }
        }

        // Parse transition speed
        const transitionAttr = this.getAttribute('transition-speed');
        if (transitionAttr) {
            const parsed = parseFloat(transitionAttr);
            if (!isNaN(parsed) && parsed > 0) {
                this.transitionSpeed = parsed;
            }
        }
    }

    render() {
        if (this.images.length === 0) {
            this.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #ddd; color: #666;">No images provided</div>';
            return;
        }

        // Create slides with first image duplicated at the end for seamless loop
        const slidesHtml = this.images.map(src => `
                    <div class="slide" style="
                        width: ${100 / (this.images.length + 1)}%;
                        height: 100%;
                        flex-shrink: 0;
                    ">
                        <img src="${src}" style="
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            display: block;
                        " alt="Slide image">
                    </div>
                `).join('');

        // Add duplicate of first image at the end
        const firstImageDuplicate = `
                    <div class="slide" style="
                        width: ${100 / (this.images.length + 1)}%;
                        height: 100%;
                        flex-shrink: 0;
                    ">
                        <img src="${this.images[0]}" style="
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            display: block;
                        " alt="Slide image">
                    </div>
                `;

        this.innerHTML = `
                    <div class="slider-container" style="
                        position: relative;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    ">
                        <div class="slider-track" style="
                            display: flex;
                            width: ${(this.images.length + 1) * 100}%;
                            height: 100%;
                            transition: transform ${this.transitionSpeed}s ease-in-out;
                            transform: translateX(0%);
                        ">
                            ${slidesHtml}${firstImageDuplicate}
                        </div>
                    </div>
                `;
    }

    goToSlide(index, skipTransition = false) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;
        const track = this.querySelector('.slider-track');

        if (track) {
            if (skipTransition) {
                track.style.transition = 'none';
            } else {
                track.style.transition = `transform ${this.transitionSpeed}s ease-in-out`;
            }

            const translateX = -(index * (100 / (this.images.length + 1)));
            track.style.transform = `translateX(${translateX}%)`;

            if (skipTransition) {
                // Force reflow to ensure the transition is removed
                track.offsetHeight;
                track.style.transition = `transform ${this.transitionSpeed}s ease-in-out`;
            }
        }
    }

    nextSlide() {
        const track = this.querySelector('.slider-track');
        if (!track) return;

        this.currentIndex++;

        // If we're at the duplicate slide (last position)
        if (this.currentIndex >= this.images.length) {
            // Move to the duplicate with transition
            const translateX = -(this.currentIndex * (100 / (this.images.length + 1)));
            track.style.transform = `translateX(${translateX}%)`;

            // After transition completes, jump back to first slide without transition
            setTimeout(() => {
                this.currentIndex = 0;
                this.goToSlide(0, true);
            }, this.transitionSpeed * 1000);
        } else {
            this.goToSlide(this.currentIndex);
        }
    }

    startSlideshow() {
        if (this.images.length <= 1) return;

        this.stopSlideshow();
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.intervalSeconds * 1000);
    }

    stopSlideshow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    restartSlideshow() {
        this.stopSlideshow();
        this.startSlideshow();
    }

    // Public methods for external control
    pause() {
        this.stopSlideshow();
    }

    play() {
        this.startSlideshow();
    }

    setImages(images) {
        this.images = images;
        this.currentIndex = 0;
        this.render();
        this.restartSlideshow();
    }
}

// Register the custom element
customElements.define('auto-image-slider', AutoImageSlider);