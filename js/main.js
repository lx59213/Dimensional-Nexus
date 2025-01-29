// 工具配置
const tools = {
    1: {
        name: '角色创建',
        description: '创建和管理你的角色（右下角导出，选择markdown格式）',
        url: 'https://dnd-character-creation.pages.dev/'
    },
    2: {
        name: '审卡',
        description: '在“character”把导出的 markdown (.md) 格式角色卡文件上传，点击“start chat”，与审卡助手一起完善角色卡，满意时可复制内容保存到本地。',
        url: 'https://udify.app/chat/JhsMXzBzkpR3sMOl'
    },
    3: {
        name: '初步备团',
        description: '在“character”上传经过审卡后角色文档文件（常见的文档格式都可以），在“model”上传模组文档，点击"Execute"，生成备团文档（为了代入感，请不要查看内容）',
        url: 'https://udify.app/workflow/AfDx6510gGvFG1IJ'
    },
    4: {
        name: '主流程',
        description: '在“outline”上传备团文档，在“character”上传角色文档，在“PL_name”输入您的昵称（不是角色名）点击“start chat”，在对话框发送"开始"，正式跑团！',
        url: 'https://udify.app/chat/By3iXUnjGdArov2a'
    }
};

// DOM 元素
const toolContent = document.getElementById('toolContent');
const stepItems = document.querySelectorAll('.step-item');
const toolHeader = document.querySelector('.tool-header');

// 工具加载函数
function loadTool(stepNumber) {
    const tool = tools[stepNumber];
    if (!tool) return;

    // 更新标题和描述
    toolHeader.querySelector('h2').textContent = tool.name;
    toolHeader.querySelector('.tool-description').textContent = tool.description;

    // 移除现有iframe
    const existingFrame = toolContent.querySelector('iframe');
    if (existingFrame) {
        existingFrame.remove();
    }

    // 创建新iframe
    const iframe = document.createElement('iframe');
    iframe.src = tool.url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'microphone';
    
    // 监听iframe加载完成事件
    iframe.onload = function() {
        try {
            // 注入自定义样式
            const customStyles = document.createElement('link');
            customStyles.rel = 'stylesheet';
            customStyles.href = '../css/dify-custom.css';
            iframe.contentDocument.head.appendChild(customStyles);

            // 注入内联样式以隐藏特定元素
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .workflow-status, .execution-details, .dify-logo, .powered-by {
                    display: none !important;
                }
            `;
            iframe.contentDocument.head.appendChild(styleElement);
        } catch (e) {
            console.log('无法注入样式，可能是由于跨域限制');
        }
    };

    toolContent.appendChild(iframe);

    // 更新活动状态
    stepItems.forEach(item => {
        if (item.dataset.step === stepNumber.toString()) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 事件监听
stepItems.forEach(item => {
    item.addEventListener('click', () => {
        const stepNumber = parseInt(item.dataset.step);
        loadTool(stepNumber);
    });
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // 向下滚动
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const tools = {
        1: { url: 'https://dnd-character-creation.pages.dev/' },
        2: { url: 'https://udify.app/chat/JhsMXzBzkpR3sMOl' },
        3: { url: 'https://udify.app/workflow/AfDx6510gGvFG1IJ' },
        4: { url: 'https://udify.app/chat/By3iXUnjGdArov2a' }
    };

    const stepItems = document.querySelectorAll('.step-item');
    const toolContent = document.getElementById('toolContent');
    
    // 添加进入动画
    stepItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });

    // 步骤点击处理
    stepItems.forEach(item => {
        item.addEventListener('click', () => {
            stepItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // 添加点击波纹效果
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            item.appendChild(ripple);
            
            const rect = item.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size/2}px`;
            ripple.style.top = `${event.clientY - rect.top - size/2}px`;
            
            setTimeout(() => ripple.remove(), 600);

            // 更新内容区域
            updateContent(item.dataset.step);
        });
    });

    // 更新内容区域的函数
    function updateContent(step) {
        const tool = tools[step];
        if (!tool) return;

        toolContent.style.opacity = '0';
        toolContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            toolContent.innerHTML = `<iframe src="${tool.url}" frameborder="0"></iframe>`;
            
            toolContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            toolContent.style.opacity = '1';
            toolContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // 添加相应的CSS
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        #toolContent {
            height: 100%;
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            background: white;
        }

        #toolContent iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});
