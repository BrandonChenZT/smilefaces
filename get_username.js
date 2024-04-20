window.onload = function () {
    const authToken = localStorage.getItem('authToken');
    const email = localStorage.getItem('email');
    document.getElementById('logout-link').classList.add('hidden');
    if (authToken && email) {
        console.log(email);
        // 用户已登录，显示邮箱和退出登录按钮
       
        document.getElementById('user-email-link').textContent = email; // 显示邮箱前缀作为昵称
        document.getElementById('user-email-link').classList.remove('hidden');
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('logout-link').classList.remove('hidden');
        
        // 绑定退出登录按钮的点击事件
        document.getElementById('logout-link').addEventListener('click', function(event) {
            event.preventDefault();
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('email');
            
            // 重置UI状态
            document.getElementById('user-email-link').textContent = '';
            document.getElementById('user-email-link').classList.add('hidden');
            document.getElementById('login-link').style.display = '';
            document.getElementById('register-link').style.display = '';
            this.style.display = 'none';
        });
    } else {
        // 用户未登录，隐藏邮箱，显示登录和注册链接
        document.getElementById('user-email-link').style.display = 'none';
        document.getElementById('login-link').style.display = '';
        document.getElementById('register-link').style.display = '';
        document.getElementById('logout-link').style.display = 'none';
    }
    
};