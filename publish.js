// 发布页面的简单实现
// 页面加载完成后执行
window.addEventListener('load', function() {
    console.log('发布页面加载完成');
    
    // 获取DOM元素
    const postContent = document.getElementById('postContent');
    const publishBtn = document.getElementById('publishBtn');
    const visibilityOptions = document.querySelectorAll('.visibility-option-simple');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    console.log('DOM元素获取结果:', {
        postContent: !!postContent,
        publishBtn: !!publishBtn,
        visibilityOptions: visibilityOptions.length,
        imageInput: !!imageInput,
        imagePreview: !!imagePreview
    });
    
    // 正面情绪引导语录列表
    const positiveQuotes = [
        '没事！！好歹我们还能吃能喝！',
        '别难过，明天会更好的！',
        '你已经很棒了！',
        '加油，一切都会过去的！',
        '相信自己，你能行！',
        '每一天都是新的开始！',
        '你值得被温柔对待！',
        '保持微笑，世界会更美好！',
        '勇敢面对，你会越来越强大！',
        '生活总会给你惊喜的！'
    ];
    
    // 全局变量：存储上传的图片
    let uploadedImage = null;
    
    // 页面加载后立即显示一个测试卡片
    setTimeout(function() {
        console.log('准备显示测试卡片');
        showTestCard();
    }, 1000);
    
    // 显示测试卡片的函数
    function showTestCard() {
        console.log('开始创建测试卡片');
        
        // 创建卡片元素
        const card = document.createElement('div');
        
        // 设置基本样式
        card.style.position = 'fixed';
        card.style.top = '50px';
        card.style.left = '50px';
        card.style.zIndex = '99999';
        card.style.backgroundColor = 'white';
        card.style.padding = '24px 32px';
        card.style.border = '3px solid red';
        card.style.borderRadius = '12px';
        card.style.fontSize = '18px';
        card.style.fontWeight = 'bold';
        card.style.color = 'black';
        card.style.textAlign = 'center';
        card.style.boxShadow = '0 6px 30px rgba(0,0,0,0.4)';
        card.style.maxWidth = '400px';
        
        // 添加文本
        const text = document.createElement('p');
        text.textContent = '测试卡片：页面加载成功！';
        text.style.margin = '0 0 20px 0';
        text.style.lineHeight = '1.4';
        card.appendChild(text);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '^ ^';
        closeBtn.style.marginTop = '10px';
        closeBtn.style.padding = '12px 24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.backgroundColor = 'red';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.fontSize = '16px';
        card.appendChild(closeBtn);
        
        // 关闭按钮事件
        closeBtn.addEventListener('click', function() {
            console.log('测试卡片关闭按钮被点击');
            card.remove();
        });
        
        // 添加到页面
        document.body.appendChild(card);
        console.log('测试卡片创建并添加到页面');
    }
    
    // 初始化可见性选项
    function initVisibilityOptions() {
        if (visibilityOptions.length === 0) {
            console.warn('没有找到可见性选项');
            return;
        }
        
        // 默认选择第一个选项
        visibilityOptions[0].classList.add('active');
        
        // 添加点击事件
        visibilityOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有选项的active类
                visibilityOptions.forEach(opt => opt.classList.remove('active'));
                // 为当前点击的选项添加active类
                this.classList.add('active');
            });
        });
    }
    
    // 初始化图片上传
    function initImageUpload() {
        if (!imageInput || !imagePreview) {
            console.warn('图片上传相关元素未找到');
            return;
        }
        
        // 图片上传按钮点击事件
        document.getElementById('addImage').addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // 创建图片预览
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    file: file,
                    src: e.target.result
                };
                
                // 如果已经有图片，替换它
                if (uploadedImage) {
                    // 移除旧的预览项
                    imagePreview.innerHTML = '';
                }
                
                uploadedImage = imageData;
                createImagePreview(imageData);
            };
            reader.readAsDataURL(file);
            
            // 清空文件输入
            imageInput.value = '';
        });
        
        // 创建图片预览
        function createImagePreview(imageData) {
            // 创建预览项
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = imageData.src;
            img.alt = '预览图片';
            
            // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'preview-delete-btn';
            deleteBtn.innerHTML = '×';
            
            // 删除按钮事件
            deleteBtn.addEventListener('click', function() {
                uploadedImage = null;
                previewItem.remove();
                imagePreview.style.display = 'none';
            });
            
            // 组装预览项
            previewItem.appendChild(img);
            previewItem.appendChild(deleteBtn);
            imagePreview.appendChild(previewItem);
            
            // 显示预览容器
            imagePreview.style.display = 'flex';
        }
    }
    
    // 显示语录卡片的函数 - 全局可访问
    window.showQuoteCard = function() {
        console.log('开始显示语录卡片');
        
        // 检查页面上是否已经存在语录卡片，如果存在则不再重复显示
        if (document.getElementById('quote-card')) {
            console.log('语录卡片已存在，不再重复显示');
            return;
        }
        
        // 随机选择一条语录
        const randomIndex = Math.floor(Math.random() * positiveQuotes.length);
        const quote = positiveQuotes[randomIndex];
        console.log('选中的语录:', quote);
        
        // 创建卡片元素
        const card = document.createElement('div');
        
        // 设置样式 - 符合淡粉色温暖氛围
        card.id = 'quote-card'; // 添加ID以便调试
        card.style.position = 'fixed';
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-50%, -50%)';
        card.style.zIndex = '999999999'; // 极高的z-index
        card.style.backgroundColor = '#fce7f3'; // 粉色背景
        card.style.padding = '40px 50px';
        card.style.border = 'none'; // 无框
        card.style.borderRadius = '15px';
        card.style.fontSize = '20px';
        card.style.fontWeight = 'bold';
        card.style.color = '#333';
        card.style.textAlign = 'center';
        card.style.minWidth = '300px';
        card.style.maxWidth = '500px';
        card.style.boxShadow = '0 10px 40px rgba(236, 72, 153, 0.3)'; // 粉色阴影效果
        card.style.opacity = '1'; // 确保不透明
        
        // 添加语录文本
        const quoteText = document.createElement('p');
        quoteText.textContent = quote;
        quoteText.style.marginBottom = '20px';
        card.appendChild(quoteText);
        
        // 添加关闭按钮 - 符合用户要求的样式，无框白底
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '^ ^'; // 使用用户要求的表情作为按钮文本
        closeBtn.style.marginTop = '20px';
        closeBtn.style.padding = '15px 32px'; // 增大按钮尺寸
        closeBtn.style.border = 'none'; // 移除边框
        closeBtn.style.borderRadius = '12px'; // 更大的圆角
        closeBtn.style.backgroundColor = 'white'; // 保留白色背景
        closeBtn.style.color = '#333';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '22px'; // 增大字体
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.textShadow = '0 2px 4px rgba(0,0,0,0.1)'; // 添加文字阴影
        closeBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; // 添加按钮阴影
        closeBtn.style.transition = 'all 0.3s ease'; // 统一过渡效果
        closeBtn.style.outline = 'none'; // 移除默认轮廓
        
        // 添加悬停效果
        closeBtn.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)'; // 更大的缩放和轻微旋转
            this.style.backgroundColor = '#fff0f8'; // 淡粉色背景增强效果
            this.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.3)'; // 粉色阴影
        });
        
        closeBtn.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)'; // 恢复原始状态
            this.style.backgroundColor = 'white'; // 恢复白色背景
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; // 恢复原始阴影
        });
        
        // 添加点击效果
        closeBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)'; // 按下时缩小
        });
        
        closeBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)'; // 释放时恢复悬停状态
        });
        
        // 添加点击关闭事件
        closeBtn.addEventListener('click', function() {
            console.log('语录卡片关闭按钮被点击');
            document.body.removeChild(card);
        });
        
        card.appendChild(closeBtn);
        
        // 添加到页面
        document.body.appendChild(card);
        console.log('语录卡片创建并添加到页面');
    }
    
    // 发布帖子函数 - 确保全局可访问
    window.publishPost = function() {
        console.log('发布按钮被点击');
        
        if (!postContent) {
            console.error('内容输入框未找到');
            alert('请输入内容');
            return;
        }
        
        // 获取内容
        const content = postContent.value.trim();
        if (!content) {
            console.warn('内容为空，发布失败');
            alert('请输入内容');
            return;
        }
        
        // 获取当前选中的可见性选项
        const selectedVisibility = document.querySelector('.visibility-option-simple.active');
        const visibilityDuration = selectedVisibility ? selectedVisibility.dataset.duration : 'forever';
        
        console.log('准备发布内容:', content);
        console.log('可见性时长:', visibilityDuration);
        
        // 模拟发布延迟
        setTimeout(function() {
            console.log('发布成功，显示语录卡片');
            
            try {
                // 创建帖子对象
                const post = {
                    id: Date.now(), // 使用时间戳作为唯一ID
                    content: content,
                    visibility: visibilityDuration,
                    createdAt: new Date().toISOString(), // 保存发布时间
                    isPublic: true, // 初始状态为公开
                    images: [] // 可以在这里添加图片数据
                };
                
                console.log('创建帖子对象:', post);
                
                // 如果有上传的图片，添加到帖子对象中
                if (uploadedImage) {
                    post.images.push({
                        src: uploadedImage.src,
                        name: uploadedImage.file.name,
                        type: uploadedImage.file.type
                    });
                    console.log('添加图片到帖子:', post.images);
                }
                
                // 保存到localStorage
                savePostToLocalStorage(post);
                console.log('保存帖子到localStorage成功');
                
                // 清空输入框
                postContent.value = '';
                
                // 清空图片预览
                if (imagePreview) {
                    imagePreview.innerHTML = '';
                    imagePreview.style.display = 'none';
                    console.log('清空图片预览');
                }
                
                // 显示语录卡片
                console.log('调用showQuoteCard函数');
                window.showQuoteCard(); // 确保调用全局函数
            } catch (error) {
                console.error('发布过程中发生错误:', error);
                // 即使发生错误，也尝试显示语录卡片
                window.showQuoteCard();
            }
            
        }, 1000);
    }
    
    // 保存帖子到localStorage
    function savePostToLocalStorage(post) {
        // 获取现有的帖子
        const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // 添加新帖子
        existingPosts.push(post);
        
        // 保存回localStorage
        localStorage.setItem('posts', JSON.stringify(existingPosts));
        
        // 同时保存到homeFeeds，以便首页显示
        const homeFeeds = JSON.parse(localStorage.getItem('homeFeeds')) || [];
        // 为帖子添加userId字段，首页需要
        post.userId = '用户' + Math.floor(Math.random() * 1000);
        homeFeeds.push(post);
        localStorage.setItem('homeFeeds', JSON.stringify(homeFeeds));
        
        console.log('帖子已保存到localStorage:', post);
    }
    
    // 检查帖子是否过期
    function checkPostExpiry(postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) return;
        
        const post = posts[postIndex];
        const now = new Date();
        const createdAt = new Date(post.createdAt);
        let expiryTime = null;
        
        // 根据可见性时长设置过期时间
        switch (post.visibility) {
            case '1day':
                expiryTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
                break;
            case '3days':
                expiryTime = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
                break;
            default: // forever
                return;
        }
        
        // 如果帖子已过期，将其设为私密
        if (now > expiryTime && post.isPublic) {
            post.isPublic = false;
            posts[postIndex] = post;
            localStorage.setItem('posts', JSON.stringify(posts));
            console.log('帖子已过期，转为私密:', post);
        }
    }
    
    // 检查所有帖子的过期状态
    function checkAllPostsExpiry() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        posts.forEach(post => {
            checkPostExpiry(post.id);
        });
    }
    
    // 定期检查帖子过期状态（每小时检查一次）
    setInterval(checkAllPostsExpiry, 60 * 60 * 1000);
    
    // 页面加载时检查一次帖子过期状态
    checkAllPostsExpiry();
    
    // 初始化发布按钮
    if (publishBtn) {
        publishBtn.addEventListener('click', publishPost);
        console.log('发布按钮事件已绑定');
    } else {
        console.error('发布按钮未找到');
    }
    
    // 初始化其他功能
    initVisibilityOptions();
    initImageUpload();
    
    console.log('发布页面初始化完成');
});