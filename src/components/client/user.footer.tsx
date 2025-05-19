import {
  FacebookFilled,
  LinkedinFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";

const UserFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Slogan */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            JobFinder<span className="text-blue-500">.pro</span>
          </h1>
          <p className="text-sm text-gray-400">
            Kết nối ứng viên và nhà tuyển dụng trên khắp Việt Nam. <br />
            Cơ hội nghề nghiệp trong tầm tay bạn.
          </p>
        </div>

        {/* Về chúng tôi */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">
            Về chúng tôi
          </h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Điều khoản
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>

        {/* Dành cho ứng viên */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Ứng viên</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Tìm việc làm
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Tạo hồ sơ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Công ty hàng đầu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Hướng dẫn
              </a>
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">
            Kết nối với chúng tôi
          </h2>
          <div className="flex space-x-4 text-2xl text-white">
            <a href="#">
              <FacebookFilled className="hover:text-blue-500 transition" />
            </a>
            <a href="#">
              <LinkedinFilled className="hover:text-blue-400 transition" />
            </a>
            <a href="#">
              <TwitterSquareFilled className="hover:text-sky-400 transition" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} JobFinder.pro - All rights reserved.
      </div>
    </footer>
  );
};

export default UserFooter;
