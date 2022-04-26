const xObject = JSON.parse(localStorage.getItem('x'));
// localStorage 里的数据什么时候会被删除？
// 答：关页面不会删除，关程序也不会删除（除非你用无痕浏览）。
//    localStorage 数据非常稳定，要手动到 chrome 高级里边删除 cookie 数据。
const hashMap = xObject || [
    {
        logo: './images/bilibili.jpeg',
        logoType: 'image',
        url: 'https://bilibili.com'
    },
    {
        logo: 'L',
        logoType: 'text',
        url: 'https://leetcode-cn.com'
    }
];

const init = function () {
    let isTouchDevice = 'ontouchstart' in document.documentElement;
    if (isTouchDevice) {// 判断设备是 触屏 还是 鼠标点击
        $('.searchForm')[0].target = '_self';
    } else {
        $('.searchForm')[0].target = '_blank';
    }
}

const render = function () {
    $('.siteList').find('li:not(.lastLi)').remove();
    hashMap.forEach((node, index)=>{
        let tempUrl = simplifyUrl(node.url);
        const $li = $(`<li>
                <div class="site">
                    <div class="logo">${tempUrl[0].toUpperCase()}</div>
                    <div class="link">${tempUrl}</div>
                    <svg class="icon-close" aria-hidden="true">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </li>
        `).insertBefore($('.lastLi'));
        // a标签是内联元素，一般内联元素不能嵌入块元素，但是a标签是个例外
        // a标签有下划线和变色问题，已经在css中处理掉
        $li.on('click', () => {
            let isTouchDevice = 'ontouchstart' in document.documentElement;
            if (isTouchDevice) {// 判断设备是 触屏 还是 鼠标点击
                window.location.href = node.url; // 跳转页面，不开新窗口
            } else {
                window.open(node.url); // 跳转页面，开新窗口
            }
        });
        $li.on('click', '.icon-close', (e) => {
            e.stopPropagation();
            hashMap.splice(index, 1);
            render();
        });
    });
};

const simplifyUrl = (url) => {
    return url.replace('https://','')
              .replace('http://','')
              .replace('www.','')
              .replace(/\/.*/,''); // 删除 / 开头的内容
};

init();
render();

$('.addSite').on('click', ()=>{
    console.log('addSite')
    let url = window.prompt('请输入网页的网址');
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    hashMap.push({
        logo: url[8],
        logoType: 'text',
        url: url
    });
    render();
});

window.onbeforeunload = ()=>{
    const str = JSON.stringify(hashMap);
    localStorage.setItem('x', str);
};

$('.icon-menu').on('click', () => {
    let $iClose = $('.siteList .icon-close');
    if ($iClose.css('display') === 'none') $iClose.css('display', 'block');
    else $iClose.css('display', 'none');
});

/*$(document).on('keydown', (e) => {
    hashMap.forEach((item) => {
        if ((item.logo.toLowerCase() === e.key)) {
            console.log(e.key);
            window.open(item.url);
        }
    })
})*/
// 这个监听函数很有问题！如果我在input框内输入搜索内容时，它也会打开网页……搞毛？？？