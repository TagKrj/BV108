import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/icons/login-icon.svg';
import '../assets/icons/user-icon.svg';
import '../assets/icons/password-icon.svg';
import '../assets/icons/eye-icon.svg';
import '../assets/icons/security-icon.svg';

const Login = () => {
    // Lấy thông tin người dùng đã lưu (nếu có)
    const rememberedUser = localStorage.getItem('bv108_rememberedUser');

    const [username, setUsername] = useState(rememberedUser || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(!!rememberedUser);
    const navigate = useNavigate();

    // Không cần kiểm tra lại trong Login component vì đã xử lý ở Route level

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username && password) {
            // Lưu thông tin đăng nhập vào localStorage
            const userInfo = {
                username,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };

            // Lưu thông tin đăng nhập
            localStorage.setItem('bv108_user', JSON.stringify(userInfo));

            // Lưu tùy chọn ghi nhớ đăng nhập nếu được chọn
            if (rememberMe) {
                localStorage.setItem('bv108_rememberedUser', username);
            } else {
                localStorage.removeItem('bv108_rememberedUser');
            }

            // Chuyển đến trang Kế toán viện phí sau khi đăng nhập thành công
            window.location.href = '/accounting';
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Container chính */}
            <div className="flex min-h-screen">
                {/* Phần bên trái - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] relative overflow-hidden">
                    {/* Grid pattern - Lưới ô vuông */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                 linear-gradient(to right, rgba(167, 214, 138, 0.3) 1px, transparent 1px),
                                 linear-gradient(to bottom, rgba(167, 214, 138, 0.3) 1px, transparent 1px)
                             `,
                            backgroundSize: '300px 300px'
                        }}>
                    </div>

                    <div className="absolute inset-0 opacity-30">
                        {/* Background pattern - Circles */}
                        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] border border-white/10 rounded-full"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] border border-white/10 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/4 w-[100px] h-[100px] bg-white/10 rounded-full"></div>

                        {/* Decorative Icons - Stars */}
                        <div className="absolute top-[15%] left-[10%] text-[#A7D68A] text-2xl">✦</div>
                        <div className="absolute top-[25%] right-[15%] text-[#A7D68A] text-xl">★</div>
                        <div className="absolute bottom-[30%] left-[15%] text-white/20 text-3xl">✦</div>
                        <div className="absolute bottom-[15%] right-[25%] text-[#A7D68A] text-xl">✦</div>
                        <div className="absolute top-[60%] right-[10%] text-white/20 text-2xl">★</div>
                        <div className="absolute top-[70%] left-[20%] text-[#A7D68A] text-lg">✦</div>

                        {/* Small Circles */}
                        <div className="absolute top-[40%] left-[8%] w-3 h-3 bg-[#A7D68A] rounded-full"></div>
                        <div className="absolute top-[80%] right-[12%] w-2 h-2 bg-white/30 rounded-full"></div>
                        <div className="absolute bottom-[40%] right-[8%] w-4 h-4 bg-[#A7D68A]/50 rounded-full"></div>
                    </div>

                    {/* Branding Content */}
                    <div className="flex flex-col items-center justify-center w-full h-full z-10 p-12">
                        <div className="flex flex-col items-center mb-auto mt-auto">
                            <div className="mb-8 flex flex-col items-center">
                                <div className="bg-amber-50 w-32 h-32 rounded-full mb-4 flex items-center justify-center">
                                    <span className="text-5xl font-semibold text-[#1A2F0C]">108</span>
                                </div>
                                <h1 className="text-3xl font-semibold text-white mt-4 tracking-widest">BỆNH VIỆN QUÂN Y 108</h1>
                                <p className="text-lg text-[#A7D68A] mt-4">Hệ thống Quản lý Viện phí</p>
                            </div>
                        </div>

                        {/* Thông tin hỗ trợ */}
                        <div className="mt-auto text-white/70 flex flex-col items-center">
                            <p className="mb-2">
                                <strong>Liên hệ hỗ trợ:</strong> (024) 3972 5555
                            </p>
                            <p className="mb-2">
                                <strong>Email:</strong> support@bv108.vn
                            </p>
                            <p className="text-sm">
                                Phiên bản 2.1.0 | © 2024 Bệnh viện Quân y 108
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phần bên phải - Form đăng nhập */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
                    <div className="w-full max-w-md p-8 border border-gray-100 rounded-[15px] shadow-lg">
                        <div className="flex items-center mb-6">
                            <img src="/src/assets/icons/login-icon.svg" alt="Login" className="w-6 h-6 text-[#2D5016]" />
                            <h2 className="text-2xl font-semibold text-[#2D5016] ml-2">Đăng nhập hệ thống</h2>
                        </div>
                        <p className="text-gray-500 mb-8">Vui lòng nhập thông tin đăng nhập của bạn</p>

                        <form onSubmit={handleSubmit}>
                            {/* Input tài khoản */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <img src="/src/assets/icons/user-icon.svg" alt="User" className="w-4 h-4 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 rounded-md focus:ring-[#2D5016] focus:border-[#2D5016] outline-none transition"
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Input mật khẩu */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <img src="/src/assets/icons/password-icon.svg" alt="Password" className="w-4 h-4 text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full py-3 pl-12 pr-12 border-2 border-gray-200 rounded-md focus:ring-[#2D5016] focus:border-[#2D5016] outline-none transition"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                    onClick={togglePasswordVisibility}
                                >
                                    <img src="/src/assets/icons/eye-icon.svg" alt="Show/Hide" className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Tùy chọn */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-[#2D5016]"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-900">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-[#2D5016] font-medium hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Nút đăng nhập */}
                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-md hover:from-[#2D5016] hover:to-[#5A8C33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D5016] transition-all"
                            >
                                ĐĂNG NHẬP
                            </button>
                        </form>

                        {/* Thông báo bảo mật */}
                        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md flex items-start">
                            <img src="/src/assets/icons/security-icon.svg" alt="Security" className="w-4 h-4 text-[#F59E0B] mt-0.5 mr-2" />
                            <div className="text-xs text-gray-600">
                                <p className="mb-1">Hệ thống được bảo mật theo tiêu chuẩn quân đội. Thông tin đăng nhập của bạn được mã hóa và bảo vệ tuyệt đối.</p>
                            </div>
                        </div>

                        {/* Chú ý */}
                        <div className="mt-6 text-gray-500">
                            <p className="text-xs mb-2"><strong>Chú ý:</strong> Chỉ nhân viên được ủy quyền mới có thể truy cập hệ thống.</p>
                            <p className="text-xs">Mọi hoạt động đăng nhập đều được ghi lại và giám sát.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
