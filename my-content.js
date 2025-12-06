// 初始化我的发布页面功能
function initMyContentPage() {
    loadMyContent();
    // 自己发布的内容不需要互动功能
}

// 加载用户发布的内容
function loadMyContent() {
    // 在实际应用中，这里应该从服务器获取用户发布的内容
    // 这里使用模拟数据，添加时间字段
    const myContent = [
        { 
            id: 1, 
            userId: "000001", 
            content: "这是我发布的第一条动态", 
            image: "assets/images/feed1.jpg",
            createdAt: "2025-12-01T10:00:00"
        },
        { 
            id: 2, 
            userId: "000001", 
            content: "这是我发布的第二条动态", 
            image: "assets/images/feed2.jpg",
            createdAt: "2025-12-02T14:30:00"
        },
        { 
            id: 3, 
            userId: "000001", 
            content: "这是我发布的第三条动态", 
            image: "assets/images/feed3.jpg",
            createdAt: "2025-12-03T09:15:00"
        },
        { 
            id: 4, 
            userId: "000001", 
            content: "这是我发布的第四条动态", 
            image: "assets/images/feed4.jpg",
            createdAt: "2025-12-04T16:45:00"
        }
    ];
    
    // 按照时间倒序排序，最新发布的放在前面
    myContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const container = document.getElementById('feedsContainer');
    container.innerHTML = '';
    
    myContent.forEach(item => {
        const feedItem = createFeedItem(item);
        container.appendChild(feedItem);
    });
}

// 创建Feed项元素
function createFeedItem(item) {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.dataset.feedId = item.id;
    
    feedItem.innerHTML = `
        <div class="feed-image-container">
            <img src="${item.image}" alt="Feed Image">
            <!-- 自己发布的内容不显示互动按钮 -->
        </div>
        <div class="feed-info">
            <div class="feed-user-id">${item.userId}</div>
            <div class="feed-content">${item.content}</div>
        </div>
    `;
    
    return feedItem;
}

// 初始化交互功能（实现单次交互和取消功能）
function initInteractions() {
    // 从localStorage获取交互数据
    let interactionData = localStorage.getItem('feedInteractions');
    interactionData = interactionData ? JSON.parse(interactionData) : {
        pat: {},
        like: {},
        favorite: {}
    };
    
    // 更新UI
    updateUI();
    
    // 监听交互按钮点击事件
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const feedId = this.dataset.feedId;
            
            // 实现单次交互和取消功能
            if (interactionData[type][feedId]) {
                // 如果已经交互过，取消交互
                interactionData[type][feedId] = false;
            } else {
                // 如果没有交互过，进行交互
                interactionData[type][feedId] = true;
            }
            
            // 保存到localStorage
            localStorage.setItem('feedInteractions', JSON.stringify(interactionData));
            
            // 更新UI
            updateUI();
        });
    });
    
    // 更新UI
    function updateUI() {
        // 统计每个类型的总交互次数
        const typeCounts = {
            pat: 0,
            like: 0,
            favorite: 0
        };
        
        // 统计各类型的总交互次数
        Object.keys(interactionData).forEach(type => {
            Object.values(interactionData[type]).forEach(isActive => {
                if (isActive) {
                    typeCounts[type]++;
                }
            });
        });
        
        // 更新每个按钮的状态和计数
        document.querySelectorAll('.interaction-btn').forEach(btn => {
            const type = btn.dataset.type;
            const feedId = btn.dataset.feedId;
            const isActive = interactionData[type][feedId] || false;
            
            // 更新按钮状态
            if (isActive) {
                btn.classList.add('active');
                // 更新收藏按钮的特殊样式
                if (type === 'favorite') {
                    btn.classList.add('favorited');
                }
            } else {
                btn.classList.remove('active');
                if (type === 'favorite') {
                    btn.classList.remove('favorited');
                }
            }
            
            // 更新按钮上的计数为该类型的总次数
            btn.querySelector('.interaction-count').textContent = typeCounts[type];
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initMyContentPage);