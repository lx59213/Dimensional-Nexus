class DecryptedText {
    constructor(options = {}) {
        this.options = {
            speed: options.speed || 60,           // 每个字符的动画速度
            maxIterations: options.maxIterations || 5,    // 变换次数
            sequential: true,                     // 默认开启顺序动画
            sequentialDelay: options.sequentialDelay || 30,  // 字符间开始时间的延迟
            revealDirection: options.revealDirection || 'start',
            useOriginalCharsOnly: options.useOriginalCharsOnly || false,
            characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
            animateOn: options.animateOn || ['view', 'hover']  // 支持数组形式，可以同时启用多种触发方式
        };
    }

    // 生成随机字符
    getRandomChar() {
        return this.options.characters[Math.floor(Math.random() * this.options.characters.length)];
    }

    // 应用动画到元素
    apply(element) {
        const originalText = element.textContent;
        let isAnimating = false;
        let animationFrameIds = [];
        let hasBeenSeen = false;  // 记录元素是否已经被看到过
        
        // 创建字符状态数组
        const chars = originalText.split('').map(char => ({
            original: char,
            current: char,
            iterations: 0,
            isRevealed: false
        }));

        // 更新显示
        const updateDisplay = () => {
            element.textContent = chars.map(char => char.current).join('');
        };

        // 动画单个字符
        const animateChar = (index) => {
            let iterations = 0;
            
            const animate = () => {
                if (!isAnimating) return;

                if (iterations < this.options.maxIterations && !chars[index].isRevealed) {
                    chars[index].current = chars[index].original === ' ' ? ' ' : this.getRandomChar();
                    iterations++;
                    updateDisplay();

                    animationFrameIds.push(setTimeout(animate, this.options.speed));
                } else {
                    chars[index].current = chars[index].original;
                    chars[index].isRevealed = true;
                    updateDisplay();
                }
            };

            // 延迟开始这个字符的动画
            setTimeout(animate, index * this.options.sequentialDelay);
        };

        // 开始所有字符的动画
        const startAnimation = () => {
            if (isAnimating) {
                stopAnimation();  // 如果正在动画，先停止当前动画
            }
            isAnimating = true;
            
            // 重置所有字符状态
            chars.forEach(char => {
                char.isRevealed = false;
                char.iterations = 0;
            });
            
            // 同时开始所有字符的动画，但每个字符有一个小的开始延迟
            chars.forEach((_, index) => {
                animateChar(index);
            });
        };

        // 停止动画
        const stopAnimation = () => {
            isAnimating = false;
            animationFrameIds.forEach(id => clearTimeout(id));
            animationFrameIds = [];
            resetAnimation();
        };

        // 重置动画
        const resetAnimation = () => {
            chars.forEach(char => {
                char.current = char.original;
                char.iterations = 0;
                char.isRevealed = false;
            });
            updateDisplay();
        };

        // 添加事件监听器
        const triggers = Array.isArray(this.options.animateOn) 
            ? this.options.animateOn 
            : [this.options.animateOn];

        // 处理hover事件
        if (triggers.includes('hover')) {
            let isHovering = false;  // 添加鼠标状态跟踪
            
            element.addEventListener('mouseenter', () => {
                isHovering = true;
                startAnimation();
            });
            
            element.addEventListener('mouseleave', () => {
                isHovering = false;
                stopAnimation();
            });
        }

        // 处理view事件
        if (triggers.includes('view')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasBeenSeen) {
                        hasBeenSeen = true;  // 标记元素已被看到
                        startAnimation();
                        // 动画完成后确保状态被重置
                        setTimeout(() => {
                            if (!isAnimating) {
                                resetAnimation();
                            }
                        }, (chars.length * this.options.sequentialDelay) + (this.options.maxIterations * this.options.speed) + 100);
                    }
                });
            });
            observer.observe(element);
        }

        // 添加必要的样式
        element.style.cursor = 'pointer';
        element.style.display = 'inline-block';
    }
}

// 全局暴露
window.DecryptedText = DecryptedText;
