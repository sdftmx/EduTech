//  EduTech Hub群资料目录js
// 文件扩展名提取函数
function getFileExtension(filename) {
    const match = filename.match(/\.([a-z0-9]+)(?=\s*\(\d|\s*$)/i);
    return match ? match[1].toLowerCase() : 'unknown';
}

// 生成目录树函数
function buildTree(parentElement, data) {
    const ul = document.createElement('ul');
    
    data.children?.forEach(item => {
        const li = document.createElement('li');
        
        if (item.type === 'folder') {
            const folder = document.createElement('span');
            folder.className = 'folder collapsed';
            folder.textContent = item.name;
            
            folder.addEventListener('click', function() {
                this.classList.toggle('expanded');
                const childList = this.parentElement.querySelector('ul');
                if (childList) childList.classList.toggle('hidden');
            });
            
            li.appendChild(folder);
            if (item.children) {
                const childUl = buildTree(li, item);
                childUl.classList.add('hidden');
            }
        } else {
            const file = document.createElement('span');
            const extension = getFileExtension(item.name);
            file.className = `file ${extension}`;
            file.textContent = item.name;
            file.title = `文件类型: ${extension.toUpperCase()}`;
            li.appendChild(file);
        }
        
        ul.appendChild(li);
    });
    
    parentElement.appendChild(ul);
    return ul;
}

// 搜索过滤功能
function filterTree() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const allItems = document.querySelectorAll('.tree li');
    
    function hasMatchingChild(element) {
        if (element.querySelector('.file')?.textContent.toLowerCase().includes(searchTerm)) {
            return true;
        }
        return [...element.children].some(child => 
            child.tagName === 'UL' && hasMatchingChild(child)
        );
    }

    allItems.forEach(item => {
        const isFolder = item.querySelector('.folder');
        const content = item.textContent.toLowerCase();
        const isMatch = content.includes(searchTerm);
        const hasChildMatch = hasMatchingChild(item);

        if (isFolder) {
            const folder = item.querySelector('.folder');
            const childList = item.querySelector('ul');
            
            if (isMatch || hasChildMatch) {
                item.style.display = 'block';
                folder.classList.add('expanded');
                if(childList) childList.classList.remove('hidden');
            } else {
                item.style.display = 'none';
            }
        } else {
            item.style.display = isMatch ? 'block' : 'none';
        }
    });
}

// 初始化
document.getElementById('searchInput').addEventListener('input', function() {
    setTimeout(filterTree, 300); // 简单防抖处理
});

const container = document.getElementById('directoryTree');
buildTree(container, directoryData);
