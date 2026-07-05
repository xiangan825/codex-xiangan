// 全局变量
let allTools = [];
let currentCategory = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadTools();
    setupSearch();
});

// 加载工具数据
async function loadTools() {
    try {
        const response = await fetch('data.json');
        allTools = await response.json();
        renderCategories();
        renderTools();
    } catch (error) {
        console.error('加载数据失败:', error);
        // 如果data.json不存在，使用示例数据
        loadSampleData();
    }
}

// 使用示例数据（当data.json不存在时）
function loadSampleData() {
    allTools = [
        {
            "name": "ChatGPT",
            "category": "聊天AI",
            "icon": "💬",
            "url": "https://chat.openai.com",
            "desc": "OpenAI开发的强大对话AI，支持多轮对话、代码生成、文本创作等"
        },
        {
            "name": "Midjourney",
            "category": "图像生成",
            "icon": "🎨",
            "url": "https://midjourney.com",
            "desc": "AI图像生成工具，通过文字描述生成高质量艺术作品"
        },
        {
            "name": "GitHub Copilot",
            "category": "编程助手",
            "icon": "👨‍💻",
            "url": "https://github.com/features/copilot",
            "desc": "AI编程助手，实时提供代码建议和自动补全"
        },
        {
            "name": "Notion AI",
            "category": "写作AI",
            "icon": "📝",
            "url": "https://www.notion.so/product/ai",
            "desc": "集成在Notion中的AI助手，帮助写作、总结和翻译"
        },
        {
            "name": "Stable Diffusion",
            "category": "图像生成",
            "icon": "🖼️",
            "url": "https://stablediffusionweb.com",
            "desc": "开源AI图像生成模型，可本地部署，高度可定制"
        },
        {
            "name": "Claude",
            "category": "聊天AI",
            "icon": "🤖",
            "url": "https://claude.ai",
            "desc": "Anthropic开发的AI助手，擅长长文本处理和逻辑推理"
        },
        {
            "name": "Cursor",
            "category": "编程助手",
            "icon": "⚡",
            "url": "https://cursor.sh",
            "desc": "AI驱动的代码编辑器，集成了强大的AI编程功能"
        },
        {
            "name": "Jasper",
            "category": "写作AI",
            "icon": "✍️",
            "url": "https://www.jasper.ai",
            "desc": "AI写作工具，专为营销文案、博客文章创作优化"
        }
    ];
    renderCategories();
    renderTools();
}

// 渲染分类列表
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    const categories = ['全部', ...new Set(allTools.map(tool => tool.category))];
    
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.dataset.category = category === '全部' ? 'all' : category;
        
        if (category === '全部') {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => filterByCategory(btn));
        li.appendChild(btn);
        categoryList.appendChild(li);
    });
}

// 分类筛选
function filterByCategory(btn) {
    // 更新按钮状态
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 筛选工具
    currentCategory = btn.dataset.category;
    renderTools();
}

// 渲染工具卡片
function renderTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    
    // 获取搜索关键词
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // 筛选工具
    let filteredTools = allTools;
    
    if (currentCategory !== 'all') {
        filteredTools = filteredTools.filter(tool => tool.category === currentCategory);
    }
    
    if (searchTerm) {
        filteredTools = filteredTools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.desc.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // 渲染卡片
    if (filteredTools.length === 0) {
        toolsGrid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        toolsGrid.style.display = 'grid';
        noResults.style.display = 'none';
        
        toolsGrid.innerHTML = '';
        filteredTools.forEach(tool => {
            const card = createToolCard(tool);
            toolsGrid.appendChild(card);
        });
    }
}

// 创建工具卡片
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.onclick = () => window.open(tool.url, '_blank');
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">${tool.icon || '🔧'}</div>
            <div>
                <div class="tool-name">${tool.name}</div>
                <span class="tool-category">${tool.category}</span>
            </div>
        </div>
        <div class="tool-desc">${tool.desc}</div>
    `;
    
    return card;
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            renderTools();
        }, 300);
    });
}
